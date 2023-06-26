import { useState, useEffect } from "react";
import { MdOutlineFavoriteBorder } from 'react-icons/md';
import { AiOutlineDelete, AiFillEdit } from 'react-icons/ai';

import {  NavLink } from 'react-router-dom';


function AlbumThumbnail({ albumId, title, onClick }) {
  const [thumbnail, setThumbnail] = useState(null);

  useEffect(() => {
    async function fetchThumbnail() {
      try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/photos?albumId=${albumId}&_limit=1`);
        const [photo] = await response.json();
        setThumbnail(photo.thumbnailUrl);
      } catch (error) {
        console.error(error);
      }
    }

    fetchThumbnail();
  }, [albumId]);

  return (
    <div className="album-thumbnail" onClick={onClick}>
      {thumbnail ? (
        <img src={thumbnail} alt={title} />
      ) : (
        <div className="placeholder" />
      )}
      <p>{title}</p>
    </div>
  );
}

function AlbumPhotos({ albumId, onClose }) {
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    async function fetchPhotos() {
      try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/photos?albumId=${albumId}`);
        const data = await response.json();
        setPhotos(data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchPhotos();
  }, [albumId]);

  return (
    <div className="album-photos">
      <button className="close-btn" onClick={onClose}>
        &times;
      </button>
      {photos.map(photo => (
        <div key={photo.id} className="photo">
          <img src={photo.url} alt={photo.title} />
          <p>{photo.title}</p>
        </div>
      ))}
    </div>
  );
}

function Albums() {
  const [albums, setAlbums] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [albumsPerPage, setAlbumsPerPage] = useState(10);
  const [selectedAlbums, setSelectedAlbums] = useState([]);
  const [showPhotosForAlbum, setShowPhotosForAlbum] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    async function fetchAlbums() {
      try {
        const response = await fetch("https://jsonplaceholder.typicode.com/albums");
        const data = await response.json();
        setAlbums(data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchAlbums();
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

  async function handleDeleteAlbum(albumId) {
    try {
      await fetch(`https://jsonplaceholder.typicode.com/albums/${albumId}`, {
        method: 'DELETE'
      });
      setAlbums(albums.filter(album => album.id !== albumId));
      setSelectedAlbums(selectedAlbums.filter(selected => selected !== albumId));
    } catch (error) {
      console.error(error);
    }
  }

  async function handleAddToFavorites(albumId) {
    try {
      console.log(`Album with ID ${albumId} added to favorites`);
    } catch (error) {
      console.error(error);
    }
  }

  function handleSelectAlbum(albumId) {
    if (selectedAlbums.includes(albumId)) {
      setSelectedAlbums(selectedAlbums.filter(selected => selected !== albumId));
    } else {
      setSelectedAlbums([...selectedAlbums, albumId]);
    }
  }

  function handlePageChange(event) {
    setCurrentPage(Number(event.target.value));
  }

  function handleAlbumsPerPageChange(event) {
    setAlbumsPerPage(Number(event.target.value));
    setCurrentPage(1);
  }

  function handleShowPhotosForAlbum(albumId) {
    setShowPhotosForAlbum(albumId);
  }

  function handleClosePhotos() {
    setShowPhotosForAlbum(null);
  }

  const indexOfLastAlbum = currentPage * albumsPerPage;
  const indexOfFirstAlbum = indexOfLastAlbum - albumsPerPage;
  const currentAlbums = albums.slice(indexOfFirstAlbum, indexOfLastAlbum);

  const filteredAlbums = currentAlbums.filter(album => {
    return album.title.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="albums container">
      <NavLink className='li d-flex' to="/">Comment</NavLink>
      <NavLink className='li d-flex' to="/Todo.jsx">Todo</NavLink>
      <div className="pagination row mt-3">
        <div className="col-md-6 mb-3 mb-md-0">
          <label htmlFor="albums-per-page" className="form-label me-3">Albums per page:</label>
          <select
            id="albums-per-page"
            className="form-select"
            value={albumsPerPage}
            onChange={handleAlbumsPerPageChange}
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>All</option>
          </select>
        </div>
        <div className="col-md-6 d-flex justify-content-end">
          <button
            className="btn btn-primary me-2"
            onClick={() =>
              setCurrentPage(currentPage => Math.max(currentPage - 1, 1))
            }
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="align-self-center">
            Page {currentPage} of {Math.ceil(albums.length / albumsPerPage)}
          </span>
          <button
            className="btn btn-primary ms-2"
            onClick={() =>
              setCurrentPage(currentPage =>
                Math.min(currentPage + 1, Math.ceil(albums.length / albumsPerPage))
              )
            }
            disabled={currentPage === Math.ceil(albums.length / albumsPerPage)}
          >
            Next
          </button>
        </div>
      </div>
      <div className="search row mb-3">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Search albums"
            value={searchTerm}
            onChange={event => setSearchTerm(event.target.value)}
          />
        </div>
        <div className="col-md-6">
          <select
            className="form-select"
            value={sortOrder}
            onChange={event => setSortOrder(event.target.value)}
          >
            <option value="asc">Sort A-Z</option>
            <option value="desc">Sort Z-A</option>
          </select>
        </div>
      </div>
      <div className="album-list">
        {filteredAlbums
          .sort((a, b) =>
            sortOrder === "asc"
              ? a.title.localeCompare(b.title)
              : b.title.localeCompare(a.title)
          )
          .map(album => (
            <div key={album.id} className="row align-items-center mb-3">
              <div className="col-md-6">
                <AlbumThumbnail
                  albumId={album.id}
                  title={album.title}
                  onClick={() => handleShowPhotosForAlbum(album.id)}
                />
              </div>
              <div className="col-md-4">
                <div className="album-actions d-flex justify-content-start">
                  <button
                    className="btn btn-outline-primary me-2"
                    onClick={() => handleAddToFavorites(album.id)}
                  >
                    <MdOutlineFavoriteBorder />
                  </button>
                  <button
                    className="btn btn-outline-danger me-2"
                    onClick={() => handleDeleteAlbum(album.id)}
                  >
                    <AiOutlineDelete />
                  </button>
                  <button
                    className="btn btn-outline-secondary"
                    onClick={() => console.log(`Edit album with ID ${album.id}`)}
                  >
                    <AiFillEdit />
                  </button>
                </div>
              </div>
              <div className="col-md-2">
                <input
                  type="checkbox"
                  checked={selectedAlbums.includes(album.id)}
                  onChange={() => handleSelectAlbum(album.id)}
                />
              </div>
            </div>
          ))}
      </div>
      {showPhotosForAlbum !== null && (
        <AlbumPhotos
          albumId={showPhotosForAlbum}
          onClose={handleClosePhotos}
        />
      )}
    </div>
  );
}

export default Albums;