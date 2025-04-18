import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../firebase/config";

interface UserProfile {
  displayName: string;
  email: string;
  about: string;
  photoURL: string;
}

export default function ProfilePage() {
  const auth = getAuth();
  const userId = auth.currentUser?.uid;

  const defaultUser: UserProfile = {
    displayName: auth.currentUser?.displayName || "Пользователь",
    email: auth.currentUser?.email || "user@example.com",
    about: "О себе...",
    photoURL: auth.currentUser?.photoURL || "https://placehold.co/100x100",
  };

  const [user, setUser] = useState<UserProfile>(defaultUser);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) return;
      const docRef = doc(db, "users", userId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUser(docSnap.data() as UserProfile);
      }
    };
    fetchProfile();
  }, [userId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUser((prev) => ({ ...prev, photoURL: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!userId) return;
    const docRef = doc(db, "users", userId);
    await setDoc(docRef, user);
    alert("Профиль сохранён!");
  };

  return (
    <div className="container mt-5">
      <h2>Профиль пользователя</h2>
      <div className="card p-4 mt-3">
        <div className="d-flex align-items-center mb-3">
          <img src={user.photoURL} alt="avatar" className="rounded-circle me-3" width={100} height={100} />
          <div>
            <input
              className="form-control mb-2"
              type="text"
              name="displayName"
              value={user.displayName}
              onChange={handleChange}
              placeholder="Имя пользователя"
            />
            <input
              className="form-control"
              type="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              placeholder="Email"
              disabled
            />
          </div>
        </div>
        <textarea
          className="form-control mb-3"
          name="about"
          value={user.about}
          onChange={handleChange}
          placeholder="О себе..."
        />
        <div className="mb-2">
          <label className="form-label">Загрузить фото</label>
          <input type="file" className="form-control" accept="image/*" onChange={handlePhotoUpload} />
        </div>
        <button className="btn btn-primary" onClick={handleSave}>Сохранить изменения</button>
      </div>
    </div>
  );
}
