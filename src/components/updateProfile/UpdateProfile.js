import './UpdateProfile.scss';
import dummyUserImg from '../../assets/user.png';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import {
  deleteMyProfile,
  showToast,
  updateMyProfile,
} from '../../redux/slices/appConfigSlice';
import { useNavigate } from 'react-router-dom';
import { axiosClient } from '../../utils/axiosClient';
import { KEY_ACCESS_TOKEN, removeItem } from '../../utils/localStorageManager';
import { TOAST_SUCCESS } from '../../App';

function UpdateProfile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const myProfile = useSelector((state) => state.appConfigReducer.myProfile);

  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [userImg, setUserImg] = useState('');

  useEffect(() => {
    console.log(myProfile);
    setName(myProfile?.name || '');
    setBio(myProfile?.bio || '');
    setUserImg(myProfile?.avatar?.url || '');
  }, [myProfile]);

  function handleImageChange(e) {
    const file = e.target.files[0];
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      if (fileReader.readyState === fileReader.DONE) {
        setUserImg(fileReader.result);
      }
    };
  }

  function handleSubmit(e) {
    e.preventDefault();
    dispatch(updateMyProfile({ name, bio, userImg }));
  }

  async function handleDeleteAccount() {
    try {
      await axiosClient.delete('/user/');
      removeItem(KEY_ACCESS_TOKEN);
      dispatch(deleteMyProfile());
      navigate('/login');
      dispatch(
        showToast({
          type: TOAST_SUCCESS,
          message: 'Your Account was successfully deleted',
        })
      );
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="UpdateProfile">
      <div className="container">
        <div className="left-part">
          <div className="input-user-img">
            <label htmlFor="inputImg" className="labelImg">
              <img src={userImg ? userImg : dummyUserImg} alt={name} />
            </label>
            <input
              className="inputImg"
              id="inputImg"
              type="file"
              accept="image/+"
              onChange={handleImageChange}
            />
          </div>
        </div>
        <div className="right-part">
          <form onSubmit={handleSubmit}>
            <input
              value={name}
              type="text"
              placeholder="Your Name"
              onChange={(e) => setName(e.target.value)}
            />
            <input
              value={bio}
              type="text"
              placeholder="Your Bio"
              onChange={(e) => setBio(e.target.value)}
            />
            <input
              type="submit"
              className="btn-primary"
              onClick={handleSubmit}
            />
          </form>

          <button
            onClick={handleDeleteAccount}
            className="delete-account btn-primary"
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}
export default UpdateProfile;
