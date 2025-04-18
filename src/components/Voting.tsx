import React, { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { collection, doc, getDocs, updateDoc, setDoc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import "bootstrap/dist/css/bootstrap.min.css";

interface MovieOption {
  id: string;
  title: string;
  votes: number;
}

export default function MovieVotingPage() {
  const auth = getAuth();
  const userId = auth.currentUser?.uid;
  const [movies, setMovies] = useState<MovieOption[]>([]);
  const [userVotedId, setUserVotedId] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovies = async () => {
      const colRef = collection(db, "movieVotes");
      const snapshot = await getDocs(colRef);
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as MovieOption));
      setMovies(data);
    };

    const fetchUserVote = async () => {
      if (!userId) return;
      const userRef = doc(db, "userVotes", userId);
      const voteSnap = await getDoc(userRef);
      if (voteSnap.exists()) {
        setUserVotedId(voteSnap.data().votedFor);
      }
    };

    fetchMovies();
    fetchUserVote();
  }, [userId]);

  const handleVote = async (movieId: string) => {
    if (!userId || userVotedId) return;

    const movieRef = doc(db, "movieVotes", movieId);
    const userRef = doc(db, "userVotes", userId);
    const selected = movies.find((m) => m.id === movieId);
    if (selected) {
      await updateDoc(movieRef, { votes: selected.votes + 1 });
      await setDoc(userRef, { votedFor: movieId });
      setUserVotedId(movieId);
      setMovies((prev) =>
        prev.map((m) => (m.id === movieId ? { ...m, votes: m.votes + 1 } : m))
      );
    }
  };

  const handleAddMovie = async () => {
    const title = prompt("Введите название фильма");
    if (title) {
      const newDoc = doc(collection(db, "movieVotes"));
      await setDoc(newDoc, { title, votes: 0 });
      setMovies([...movies, { id: newDoc.id, title, votes: 0 }]);
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>Голосование за фильм</h4>
        <button className="btn btn-outline-primary" onClick={handleAddMovie}>Добавить фильм</button>
      </div>
      <ul className="list-group">
        {movies.map((movie) => (
          <li key={movie.id} className="list-group-item d-flex justify-content-between align-items-center">
            {movie.title}
            <div>
              <span className="badge bg-secondary me-2">{movie.votes}</span>
              <button
                className="btn btn-sm btn-success"
                onClick={() => handleVote(movie.id)}
                disabled={!!userVotedId}
              >
                {userVotedId === movie.id ? "Вы проголосовали" : "Голосовать"}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
