import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  orderBy,
  limit,
  serverTimestamp,
  increment,
  onSnapshot,
} from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from './firebase';
import { Post, Story, CollabRequest, CreatorMonetizationState, PostComment } from '../types';

/**
 * -------------------------------------------------------------
 * POSTS SERVICE (Saved to /posts in Firestore `(default)`)
 * -------------------------------------------------------------
 */
export async function savePostToFirestore(post: Post): Promise<boolean> {
  const collectionPath = 'posts';
  try {
    const postRef = doc(db, collectionPath, post.id);
    // Convert undefined to delete/omit for Firestore compatibility
    const cleanPostData = {
      ...post,
      mediaUrl: post.mediaUrl || null,
      musicTitle: post.musicTitle || null,
      musicArtist: post.musicArtist || null,
      musicUrl: post.musicUrl || null,
      collabRole: post.collabRole || null,
      authorBio: post.authorBio || null,
      authorCover: post.authorCover || null,
      savedAt: new Date().toISOString(),
    };
    await setDoc(postRef, cleanPostData, { merge: true });
    return true;
  } catch (error) {
    console.error('Error saving post to Firestore:', error);
    try {
      handleFirestoreError(error, OperationType.CREATE, `${collectionPath}/${post.id}`);
    } catch {
      // Return false gracefully if offline or permissions pending
    }
    return false;
  }
}

export async function fetchPostsFromFirestore(): Promise<Post[]> {
  const collectionPath = 'posts';
  try {
    const q = query(collection(db, collectionPath), limit(50));
    const querySnapshot = await getDocs(q);
    const posts: Post[] = [];
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data() as Post;
      posts.push({ ...data, id: docSnap.id });
    });
    return posts;
  } catch (error) {
    console.warn('Could not fetch posts from Firestore (using local/fallback feed):', error);
    return [];
  }
}

export async function updatePostLikeInFirestore(postId: string, newLikesCount: number): Promise<void> {
  const docPath = `posts/${postId}`;
  try {
    const postRef = doc(db, 'posts', postId);
    await updateDoc(postRef, {
      likesCount: newLikesCount,
    });
  } catch (error) {
    console.warn('Could not sync post like to Firestore:', error);
  }
}

export async function addCommentToFirestore(postId: string, comment: PostComment, updatedComments: PostComment[]): Promise<void> {
  const docPath = `posts/${postId}`;
  try {
    const postRef = doc(db, 'posts', postId);
    await updateDoc(postRef, {
      commentsCount: updatedComments.length,
      comments: updatedComments,
    });
  } catch (error) {
    console.warn('Could not sync comment to Firestore:', error);
  }
}

/**
 * -------------------------------------------------------------
 * STORIES SERVICE (Saved to /stories in Firestore `(default)`)
 * -------------------------------------------------------------
 */
export async function saveStoryToFirestore(story: Story): Promise<boolean> {
  const collectionPath = 'stories';
  try {
    const storyRef = doc(db, collectionPath, story.id);
    const cleanStory = {
      ...story,
      musicTitle: story.musicTitle || null,
      musicUrl: story.musicUrl || null,
      caption: story.caption || null,
      savedAt: new Date().toISOString(),
    };
    await setDoc(storyRef, cleanStory, { merge: true });
    return true;
  } catch (error) {
    console.warn('Could not save story to Firestore:', error);
    return false;
  }
}

export async function fetchStoriesFromFirestore(): Promise<Story[]> {
  const collectionPath = 'stories';
  try {
    const querySnapshot = await getDocs(collection(db, collectionPath));
    const stories: Story[] = [];
    querySnapshot.forEach((docSnap) => {
      stories.push({ ...(docSnap.data() as Story), id: docSnap.id });
    });
    return stories;
  } catch (error) {
    console.warn('Could not fetch stories from Firestore:', error);
    return [];
  }
}

/**
 * -------------------------------------------------------------
 * COLLABS SERVICE (Saved to /collabs in Firestore `(default)`)
 * -------------------------------------------------------------
 */
export async function saveCollabToFirestore(collab: CollabRequest): Promise<boolean> {
  const collectionPath = 'collabs';
  try {
    const collabRef = doc(db, collectionPath, collab.id);
    await setDoc(collabRef, collab, { merge: true });
    return true;
  } catch (error) {
    console.warn('Could not save collab to Firestore:', error);
    return false;
  }
}

export async function fetchCollabsFromFirestore(): Promise<CollabRequest[]> {
  const collectionPath = 'collabs';
  try {
    const querySnapshot = await getDocs(collection(db, collectionPath));
    const collabs: CollabRequest[] = [];
    querySnapshot.forEach((docSnap) => {
      collabs.push({ ...(docSnap.data() as CollabRequest), id: docSnap.id });
    });
    return collabs;
  } catch (error) {
    console.warn('Could not fetch collabs from Firestore:', error);
    return [];
  }
}

/**
 * -------------------------------------------------------------
 * DIRECT MESSAGES SERVICE (Saved to /conversations/{convId}/messages/{msgId})
 * -------------------------------------------------------------
 */
export interface DirectMessagePayload {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  timestamp: string;
  isMe?: boolean;
}

export async function saveMessageToFirestore(convId: string, message: DirectMessagePayload): Promise<boolean> {
  try {
    const msgRef = doc(db, 'conversations', convId, 'messages', message.id);
    await setDoc(msgRef, {
      ...message,
      createdAt: new Date().toISOString(),
    });
    return true;
  } catch (error) {
    console.warn('Could not save message to Firestore:', error);
    return false;
  }
}

export async function fetchMessagesFromFirestore(convId: string): Promise<DirectMessagePayload[]> {
  try {
    const q = collection(db, 'conversations', convId, 'messages');
    const querySnapshot = await getDocs(q);
    const msgs: DirectMessagePayload[] = [];
    querySnapshot.forEach((docSnap) => {
      msgs.push(docSnap.data() as DirectMessagePayload);
    });
    return msgs;
  } catch (error) {
    console.warn('Could not fetch messages from Firestore:', error);
    return [];
  }
}

/**
 * -------------------------------------------------------------
 * MONETIZATION SETTINGS (Saved to /users/{userId} in Firestore `(default)`)
 * -------------------------------------------------------------
 */
export async function saveMonetizationSettingsToFirestore(
  userId: string,
  settings: CreatorMonetizationState
): Promise<boolean> {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      monetization: settings,
      updatedAt: new Date().toISOString(),
    });
    return true;
  } catch (error) {
    console.warn('Could not sync monetization settings to Firestore:', error);
    return false;
  }
}

/**
 * -------------------------------------------------------------
 * NOTIFICATIONS SERVICE (Saved to /notifications in Firestore `(default)`)
 * -------------------------------------------------------------
 */
export interface FirestoreNotification {
  id: string;
  recipientId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  type: 'like' | 'follow' | 'comment' | 'collab' | 'gift' | 'subscription';
  text: string;
  isRead: boolean;
  createdAt: string;
}

export async function saveNotificationToFirestore(notification: FirestoreNotification): Promise<boolean> {
  try {
    const notifRef = doc(db, 'notifications', notification.id);
    await setDoc(notifRef, notification, { merge: true });
    return true;
  } catch (error) {
    console.warn('Could not save notification to Firestore:', error);
    return false;
  }
}
