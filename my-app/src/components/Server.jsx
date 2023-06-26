import { useState, useEffect } from "react";
import { MdOutlineFavoriteBorder } from 'react-icons/md'
import { FaRegCommentDots } from 'react-icons/fa'
import { AiOutlineDelete, AiFillEdit } from 'react-icons/ai'

import {  NavLink } from 'react-router-dom';


function MyComponent() {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(10);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await fetch("https://jsonplaceholder.typicode.com/posts");
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchPosts();
  }, []);

  async function getUser(userId) {
    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
      const user = await response.json();
      return user;
    } catch (error) {
      console.error(error);
    }
  }

  async function handleDeletePost(postId) {
    try {
      await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`, {
        method: 'DELETE'
      });
      setPosts(posts.filter(post => post.id !== postId));
    } catch (error) {
      console.error(error);
    }
  }

  async function handleAddToFavorites(postId) {
    try {
      console.log(`Post with ID ${postId} added to favorites`);
    } catch (error) {
      console.error(error);
    }
  }

  function handlePageChange(event) {
    setCurrentPage(Number(event.target.value));
  }

  function handlePostsPerPageChange(event) {
    setPostsPerPage(Number(event.target.value));
    setCurrentPage(1);
  }

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  async function handleAddComment(postId, comment) {
    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/comments`, {
        method: 'POST',
        body: JSON.stringify({
          postId,
          name: 'John Doe',
          email: 'johndoe@example.com',
          body: comment
        }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      });
      const newComment = await response.json();
      const updatedPosts = posts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            comments: [...post.comments, newComment]
          }
        }
        return post;
      });
      setPosts(updatedPosts);
    } catch (error) {
      console.error(error);
    }
  }

  function handleCommentClick(postId) {
    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          showComments: !post.showComments
        }
      }
      return post;
    });
    setPosts(updatedPosts);
  }

  function handleEditClick(postId) {
    console.log(`Edit clicked for post with ID ${postId}`);
  }

  return (
    <div className="container">
      <NavLink className='li d-flex' to="/Album.jsx">Album</NavLink>
      <NavLink className='li d-flex' to="/Todo.jsx">Todo</NavLink>
      <div className="row">
        <div className="col-12">
          <h1>My Posts</h1>
          <div className="form-group">
            <label htmlFor="posts-per-page">Posts per page:</label>
            <select className="form-control" id="posts-per-page" value={postsPerPage} onChange={handlePostsPerPageChange}>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">All</option>
            </select>
          </div>
          <div>
            {currentPosts.map((post) => (
              <div key={post.id} className="post card mb-3">
                <div className="card-header post-header">
                  <h2>{post.title}</h2>
                  <p>{getUser(post.userId)?.name}</p>
                </div>
                <div className="card-body">
                  <p className="card-text">{post.body}</p>
                </div>
                <div className="card-footer post-footer">
                  <div className="post-actions">
                    <button className="btn btn-link" onClick={() => handleAddToFavorites(post.id)}>
                      <MdOutlineFavoriteBorder /> Add to favorites
                    </button>
                    <button className="btn btn-link" onClick={() => handleCommentClick(post.id)}>
                      <FaRegCommentDots /> {post.showComments ? 'Hide' : 'Show'} comments
                    </button>
                    <button className="btn btn-link" onClick={() => handleEditClick(post.id)}>
                      <AiFillEdit /> Edit
                    </button>
                    <button className="btn btn-link" onClick={() => handleDeletePost(post.id)}>
                      <AiOutlineDelete /> Delete
                    </button>
                  </div>

                  {post.showComments && (
                    <div className="post-comments">
                      {post.comments?.map(comment => (
                        <div key={comment.id} className="comment card mt-3">
                          <div className="card-header">
                            <h6>{comment.name}</h6>
                            <p>{comment.email}</p>
                          </div>
                          <div className="card-body">
                            <p className="card-text">{comment.body}</p>
                          </div>
                        </div>
                      ))}
                      <div className="add-comment">
                        <form onSubmit={(event) => {
                          event.preventDefault();
                          const commentInput = event.target.elements.comment;
                          handleAddComment(post.id, commentInput.value);
                          commentInput.value = '';
                        }}>
                          <div className="form-group">
                            <label htmlFor={`comment-${post.id}`}>Add a comment:</label>
                            <textarea className="form-control" id={`comment-${post.id}`} rows="3" name="comment"></textarea>
                          </div>
                          <button type="submit" className="btn btn-primary">Add comment</button>
                        </form>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="pagination">
            <button className="btn btn-link" disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>Previous</button>
            {Array.from({ length: Math.ceil(posts.length / postsPerPage) }, (_, i) => (
              <button key={i} className={`btn ${i + 1 === currentPage ? 'btn-primary' : 'btn-link'}`} value={i + 1} onClick={handlePageChange}>{i + 1}</button>
            ))}
            <button className="btn btn-link" disabled={currentPage === Math.ceil(posts.length / postsPerPage)} onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyComponent;