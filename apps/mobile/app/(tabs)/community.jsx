import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import mobileApiClient from '../../src/services/api.js';
import MobileCard from '../../src/components/MobileCard.jsx';
import colors from '../../src/theme/colors.js';

export default function MobileCommunityScreen() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const res = await mobileApiClient.get('/community/posts');
      if (res.data) setPosts(res.data);
    } catch (err) {
      console.error('Failed to load mobile posts:', err);
    }
  };

  const handleLike = async (postId) => {
    try {
      const res = await mobileApiClient.post(`/community/posts/${postId}/like`);
      if (res.data) {
        setPosts((prev) =>
          prev.map((p) =>
            p._id === postId
              ? { ...p, likesCount: res.data.likesCount, hasLiked: res.data.hasLiked }
              : p
          )
        );
      }
    } catch (err) {
      console.error('Like error:', err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Adventurer Feed</Text>
      <Text style={styles.headerSubtitle}>Real-time accomplishments from heroes across the realm</Text>

      <FlatList
        data={posts}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <MobileCard style={styles.postCard}>
            <View style={styles.postHeader}>
              <View style={styles.avatarMini}>
                <Text style={styles.avatarInitial}>
                  {item.userId?.username?.charAt(0).toUpperCase() || 'H'}
                </Text>
              </View>
              <View style={styles.authorMeta}>
                <Text style={styles.authorName}>{item.userId?.username || 'Hero'}</Text>
                <Text style={styles.categoryBadge}>{item.category}</Text>
              </View>
            </View>

            <Text style={styles.content}>{item.content}</Text>

            <View style={styles.postFooter}>
              <TouchableOpacity
                onPress={() => handleLike(item._id)}
                style={styles.likeBtn}
              >
                <Text style={[styles.likeText, item.hasLiked && styles.likedActive]}>
                  ❤️ {item.likesCount || 0} Likes
                </Text>
              </TouchableOpacity>
              <Text style={styles.commentCount}>💬 {item.commentsCount || 0} Comments</Text>
            </View>
          </MobileCard>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: 48,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: colors.textPrimary,
    paddingHorizontal: 16,
  },
  headerSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    paddingHorizontal: 16,
    marginTop: 4,
    marginBottom: 16,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  postCard: {
    marginBottom: 12,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatarMini: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.primaryPurple,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    color: '#FFF',
    fontWeight: '800',
    fontSize: 16,
  },
  authorMeta: {
    marginLeft: 10,
  },
  authorName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  categoryBadge: {
    fontSize: 10,
    color: colors.neonCyan,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  content: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
    marginBottom: 12,
  },
  postFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.borderSubtle,
  },
  likeBtn: {
    paddingVertical: 4,
  },
  likeText: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '600',
  },
  likedActive: {
    color: colors.errorRed,
  },
  commentCount: {
    fontSize: 12,
    color: colors.textMuted,
  },
});
