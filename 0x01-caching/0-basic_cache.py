#!/usr/bin/env python3
"""Basic Dictionary"""


BaseCaching = __import__('base_caching').BaseCaching


class BasicCache(BaseCaching):
    """BasicCache class"""
    def put(self, key, item):
        """Adds an item in the cache"""
        if key is None or item is None:
            pass
        else:
            self.cache_data[key] = item

    def get(self, key):
        """Gets an item by key"""
        if key in self.cache_data:
            return self.cache_data[key]
        else:
            return None
