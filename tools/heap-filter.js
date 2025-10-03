// utils/heap.js - Heap-based bullet filtering

export class MinHeap {
    constructor() {
      this.heap = [];
    }
  
    insert(bullet) {
      this.heap.push(bullet);
      this.bubbleUp(this.heap.length - 1);
    }
  
    extractMin() {
      if (this.heap.length === 0) return null;
      if (this.heap.length === 1) return this.heap.pop();
      
      const min = this.heap[0];
      this.heap[0] = this.heap.pop();
      this.sinkDown(0);
      return min;
    }
  
    peek() {
      return this.heap[0] || null;
    }
  
    size() {
      return this.heap.length;
    }
  
    bubbleUp(index) {
      const element = this.heap[index];
      while (index > 0) {
        const parentIndex = Math.floor((index - 1) / 2);
        const parent = this.heap[parentIndex];
        
        if (element.relevance_score >= parent.relevance_score) break;
        
        this.heap[parentIndex] = element;
        this.heap[index] = parent;
        index = parentIndex;
      }
    }
  
    sinkDown(index) {
      const length = this.heap.length;
      const element = this.heap[index];
      
      while (true) {
        let leftChildIndex = 2 * index + 1;
        let rightChildIndex = 2 * index + 2;
        let swap = null;
  
        if (leftChildIndex < length) {
          if (this.heap[leftChildIndex].relevance_score < element.relevance_score) {
            swap = leftChildIndex;
          }
        }
  
        if (rightChildIndex < length) {
          if (
            (swap === null && this.heap[rightChildIndex].relevance_score < element.relevance_score) ||
            (swap !== null && this.heap[rightChildIndex].relevance_score < this.heap[swap].relevance_score)
          ) {
            swap = rightChildIndex;
          }
        }
  
        if (swap === null) break;
        
        this.heap[index] = this.heap[swap];
        this.heap[swap] = element;
        index = swap;
      }
    }
  }
  
  /**
   * Filters bullets by company, keeping top K per company based on relevance score
   * @param {Array} bullets - Array of bullet objects with relevance_score
   * @param {number} topK - Number of bullets to keep per company
   * @param {number} minScore - Minimum score threshold (optional)
   * @returns {Object} Object with company names as keys and filtered bullet arrays as values
   */
  export function filterBulletsByCompany(bullets, topK = 5, minScore = 0) {
    // Group by company
    const companies = {};
    
    bullets.forEach(bullet => {
      const company = bullet.company || 'Unknown';
      if (!companies[company]) {
        companies[company] = [];
      }
      
      // Only include bullets meeting minimum score
      if (bullet.relevance_score >= minScore) {
        companies[company].push(bullet);
      }
    });
  
    // Sort and filter each company
    const result = {};
    
    for (const [company, companyBullets] of Object.entries(companies)) {
      // Sort by relevance_score descending (highest first)
      const sorted = companyBullets.sort((a, b) => 
        b.relevance_score - a.relevance_score
      );
      
      // Keep top K
      result[company] = sorted.slice(0, topK);
    }
  
    return result;
  }
  
  /**
   * Alternative heap-based implementation for educational purposes
   * Same result as filterBulletsByCompany but uses MinHeap
   */
  export function filterBulletsWithHeap(bullets, topK = 5, minScore = 0) {
    const companies = {};
    
    bullets.forEach(bullet => {
      const company = bullet.company || 'Unknown';
      if (!companies[company]) {
        companies[company] = new MinHeap();
      }
      
      if (bullet.relevance_score >= minScore) {
        companies[company].insert(bullet);
        
        // Keep only top K by removing lowest scores
        if (companies[company].size() > topK) {
          companies[company].extractMin();
        }
      }
    });
  
    // Convert heaps to sorted arrays
    const result = {};
    for (const [company, heap] of Object.entries(companies)) {
      const arr = [];
      while (heap.size() > 0) {
        arr.unshift(heap.extractMin()); // Add to front to maintain order
      }
      result[company] = arr.sort((a, b) => b.relevance_score - a.relevance_score);
    }
  
    return result;
  }