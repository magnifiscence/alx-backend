#!/usr/bin/env python3
"""LIFO caching"""

BaseCaching = __import__('base_caching').BaseCaching


class LIFOCache(BaseCaching):
    """LIFO caching"""
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
                    last = self.queue.pop()
                    del self.cache_data[last]
                    print("DISCARD:", last)
                self.queue.append(key)
                self.cache_data[key] = item

    def get(self, key):
        """Get an item by key"""
        if key and key in self.cache_data:
            return self.cache_data[key]
        return None
