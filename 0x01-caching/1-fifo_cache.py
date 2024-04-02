#!/usr/bin/env python3
"""FIFO caching"""

BaseCaching = __import__('base_caching').BaseCaching


class FIFOCache(BaseCaching):
    """FIFO caching"""
    def __init__(self):
        """Initialize"""
        super().__init__()
        self.queue = []

    def put(self, key, item):
        """Add an item in the cache"""
        if key and item:
            if key in self.cache_data:
                self.cache_data[key] = item
            else:
                if len(self.cache_data) >= self.MAX_ITEMS:
                    first = self.queue.pop(0)
                    del self.cache_data[first]
                    print("DISCARD:", first)
                self.queue.append(key)
                self.cache_data[key] = item

    def get(self, key):
        """Get an item by key"""
        if key and key in self.cache_data:
            return self.cache_data[key]
        return None
