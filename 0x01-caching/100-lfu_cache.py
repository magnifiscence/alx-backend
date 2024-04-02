#!/usr/bin/env python3
"""LFU caching"""

BaseCaching = __import__('base_caching').BaseCaching


class LFUCache(BaseCaching):
    """LFU caching"""
    def __init__(self):
        """Initialize"""
        super().__init__()
        self.queue = []
        self.count = {}

    def put(self, key, item):
        """Add an item in the cache"""
        if key and item:
            if key in self.cache_data:
                self.cache_data[key] = item
                self.count[key] += 1
            else:
                if len(self.cache_data) >= self.MAX_ITEMS:
                    min_count = min(self.count.values())
                    min_keys = [k for k in self.count
                                if self.count[k] == min_count]
                    for k in min_keys:
                        del self.cache_data[k]
                        del self.count[k]
                        break
                    print("DISCARD:", min_keys[0])
                self.cache_data[key] = item
                self.count[key] = 1

    def get(self, key):
        """Get an item by key"""
        if key and key in self.cache_data:
            self.count[key] += 1
            return self.cache_data[key]
        return None
