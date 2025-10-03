#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Manually load .env WITHOUT dotenv package
try {
  const envPath = join(__dirname, '.env');
  const envContent = readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=:#]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim();
      process.env[key] = value;
    }
  });
} catch (e) {
  // Silently fail if .env doesn't exist
}

const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL;

const server = new Server(
  {
    name: 'resume-optimizer',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

async function fetchResumeData(jobNumber) {
  if (!N8N_WEBHOOK_URL) {
    throw new Error('N8N_WEBHOOK_URL not configured in .env file');
  }

  const url = `${N8N_WEBHOOK_URL}?number=${jobNumber}`;
  const response = await fetch(url);
  const data = await response.json();

  return data;
}

function assignBulletIds(resumeData) {
  const companies = {};
  const bullets = resumeData.data.bullets.map((bullet) => {
    const company = bullet.company;
    companies[company] = (companies[company] || 0) + 1;
    const companyLetter = Object.keys(companies).indexOf(company);
    const bulletNumber = companies[company];
    const id = `${String.fromCharCode(65 + companyLetter)}${bulletNumber}`;
    
    return { ...bullet, id };
  });

  return { ...resumeData, data: { ...resumeData.data, bullets } };
}

function deleteBulletsById(resumeData, bulletIds) {
  const bullets = resumeData.data.bullets.filter(
    (bullet) => !bulletIds.includes(bullet.id)
  );

  return { ...resumeData, data: { ...resumeData.data, bullets } };
}

function filterBulletsByScore(resumeData, minScore = 75, bulletsPerCompany = 5) {
  const companyCounts = {};
  const bullets = resumeData.data.bullets
    .sort((a, b) => b.relevance_score - a.relevance_score)
    .filter((bullet) => {
      if (bullet.relevance_score < minScore) return false;
      
      const company = bullet.company;
      companyCounts[company] = (companyCounts[company] || 0) + 1;
      
      return companyCounts[company] <= bulletsPerCompany;
    });

  return { ...resumeData, data: { ...resumeData.data, bullets } };
}

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'fetch_resume_data',
        description: 'Fetches resume bullet points with relevance scores from N8N workflow',
        inputSchema: {
          type: 'object',
          properties: {
            job_number: {
              type: 'number',
              description: 'Job application number (e.g., 33, 34, 35)',
            },
          },
          required: ['job_number'],
        },
      },
      {
        name: 'assign_bullet_ids',
        description: 'Assigns unique IDs (A1, A2, B1, etc.) to bullets for easy reference',
        inputSchema: {
          type: 'object',
          properties: {
            resume_data: {
              type: 'object',
              description: 'Resume data from fetch_resume_data',
            },
          },
          required: ['resume_data'],
        },
      },
      {
        name: 'delete_bullets_by_id',
        description: 'Removes bullets by their IDs (e.g., ["A3", "B1", "C2"])',
        inputSchema: {
          type: 'object',
          properties: {
            resume_data: {
              type: 'object',
              description: 'Resume data with bullets',
            },
            bullet_ids: {
              type: 'array',
              items: { type: 'string' },
              description: 'Array of bullet IDs to delete',
            },
          },
          required: ['resume_data', 'bullet_ids'],
        },
      },
      {
        name: 'filter_bullets_by_score',
        description: 'Filters bullets by minimum score and limits per company',
        inputSchema: {
          type: 'object',
          properties: {
            resume_data: {
              type: 'object',
              description: 'Resume data',
            },
            min_score: {
              type: 'number',
              default: 75,
              description: 'Minimum score threshold',
            },
            bullets_per_company: {
              type: 'number',
              default: 5,
              description: 'Max bullets per company',
            },
          },
          required: ['resume_data'],
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    let result;

    switch (name) {
      case 'fetch_resume_data':
        result = await fetchResumeData(args.job_number);
        break;

      case 'assign_bullet_ids':
        result = assignBulletIds(args.resume_data);
        break;

      case 'delete_bullets_by_id':
        result = deleteBulletsById(args.resume_data, args.bullet_ids);
        break;

      case 'filter_bullets_by_score':
        result = filterBulletsByScore(
          args.resume_data,
          args.min_score,
          args.bullets_per_company
        );
        break;

      default:
        throw new Error(`Unknown tool: ${name}`);
    }

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${error.message}`,
        },
      ],
      isError: true,
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  process.exit(1);
});