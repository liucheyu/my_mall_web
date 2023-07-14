import firebase from 'firebase/app';

const storageRef = firebase.storage().ref();

const filebaseUpload = {};

/**
 * 後面接.then((snapshot) => {
      // 文件上传成功
    })
    .catch((error) => {
      // 处理错误
    });
 */
filebaseUpload.updateFileToFirebase = (token, path, file) => {
  const fileRef = storageRef.child(path);
  return firebase.auth().signInWithCustomToken(token)
    .then(() => {
      return fileRef.put(file);
    });
}

export default filebaseUpload;
