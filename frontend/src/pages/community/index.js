import React, { useState } from 'react';
import { useRouter } from 'next/router';

const CommunityPage = () => {
  const router = useRouter();
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: "Rajesh Kumar",
      role: "Organic Farmer",
      content: "Just implemented drip irrigation in my 2-acre plot. The water consumption has reduced by 40%! Happy to share my experience with anyone interested in water conservation techniques.",
      likes: 45,
      comments: 12,
      tags: ["WaterConservation", "OrganicFarming"],
      timestamp: new Date('2024-02-21T10:00:00')
    },
    {
      id: 2,
      author: "Priya Singh",
      role: "Agricultural Expert",
      content: "Latest market analysis shows increasing demand for organic vegetables in urban areas. Here's a breakdown of the most sought-after produce and recommended pricing strategies for the upcoming season.",
      likes: 89,
      comments: 24,
      tags: ["MarketInsights", "OrganicProduce"],
      timestamp: new Date('2024-02-21T07:00:00')
    }
  ]);

  const [newPost, setNewPost] = useState('');
  const [sortBy, setSortBy] = useState('Latest');

  const handleNewPost = () => {
    if (!newPost.trim()) return;
    
    const post = {
      id: posts.length + 1,
      author: "Current User",
      role: "Farmer",
      content: newPost,
      likes: 0,
      comments: 0,
      tags: [],
      timestamp: new Date()
    };
    
    setPosts([post, ...posts]);
    setNewPost('');
  };

  const handleSort = (sortType) => {
    const sortedPosts = [...posts];
    switch (sortType) {
      case 'Latest':
        sortedPosts.sort((a, b) => b.timestamp - a.timestamp);
        break;
      case 'Top Rated':
        sortedPosts.sort((a, b) => b.likes - a.likes);
        break;
      case 'Most Discussed':
        sortedPosts.sort((a, b) => b.comments - a.comments);
        break;
    }
    setPosts(sortedPosts);
  };

  const formatTimestamp = (timestamp) => {
    const diff = new Date() - new Date(timestamp);
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return 'Just now';
    if (hours === 1) return '1h ago';
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <div className="min-h-screen bg-[#0B513B] py-8">
      <div className="max-w-4xl mx-auto px-4">
        <button onClick={() => router.push('/dashboard')} className="text-white hover:text-emerald-100 underline">
          ← Back to Home
        </button>
        <h1 className="text-2xl font-bold mb-8 text-white">AgriChain Community</h1>
        
        {/* New Post Creation */}
        <div className="bg-emerald-50 rounded-lg shadow-lg p-6 mb-6">
          <textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="Share your farming experience or ask a question..."
            className="w-full p-3 border border-emerald-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
            rows="3"
          />
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleNewPost}
              className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-800 transition-colors"
            >
              Post
            </button>
          </div>
        </div>

        {/* Sort Controls */}
        <div className="flex justify-end mb-6">
          <select 
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              handleSort(e.target.value);
            }}
            className="border bg-emerald-50 border-emerald-400 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-300 text-emerald-900"
          >
            <option>Latest</option>
            <option>Top Rated</option>
            <option>Most Discussed</option>
          </select>
        </div>

        {/* Posts List */}
        <div className="space-y-6">
          {posts.map((post) => (
            <div key={post.id} className="bg-emerald-50 rounded-lg shadow-lg p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-emerald-700 rounded-full flex items-center justify-center text-white font-bold">
                  {post.author[0]}
                </div>
                <div>
                  <h3 className="font-semibold text-emerald-900">{post.author}</h3>
                  <span className="text-sm bg-emerald-200 text-emerald-800 px-2 py-1 rounded">
                    {post.role}
                  </span>
                </div>
                <span className="ml-auto text-sm text-emerald-700">
                  {formatTimestamp(post.timestamp)}
                </span>
              </div>

              <p className="text-emerald-800 mb-4">{post.content}</p>

              <div className="flex gap-2 mb-4">
                {post.tags.map((tag, index) => (
                  <span 
                    key={index} 
                    className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm border border-emerald-200"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-6 text-emerald-700">
                <button className="flex items-center gap-2 hover:text-emerald-900 transition-colors">
                  <span>👍</span>
                  <span>{post.likes}</span>
                </button>
                <button className="flex items-center gap-2 hover:text-emerald-900 transition-colors">
                  <span>💬</span>
                  <span>{post.comments}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;