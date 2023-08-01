import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/storage';

const filebaseUpload = {};

/**
 * 後面接.then((snapshot) => {
      // 文件上传成功
    })
    .catch((error) => {
      // 处理错误
    });
 */
filebaseUpload.updateFileToFirebase = (path, file) => {
  console.log('upload file', path, file);
  const storageRef = firebase.storage().ref();
  const fileRef = storageRef.child(path);
  let uploadTask = fileRef.put(file);
  return uploadTask
    .then(function (snapshot) {
      console.log('Uploaded", snapshot.totalBytes, "bytes.');
      console.log('File metadata:', snapshot.metadata);
      // Let's get a download URL for the file.
      return snapshot.ref.getDownloadURL().then(function (url) {
        console.log('File available at', url);
        return {
          url: url,
          metadata: snapshot.metadata
        };
      });
    })
    .catch(function (error) {
      console.error('Upload failed:', error);
    });
}

filebaseUpload.listenEven = (uploadTask) => {
  uploadTask.on(
    'state_changed',
    (snapshot) => {
      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
      const progress =
        (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log('Upload is ' + progress + '% done');
      switch (snapshot.state) {
        case 'paused':
          console.log('Upload is paused');
          break;
        case 'running':
          console.log('Upload is running');
          break;
      }
    },
    (error) => {
      // A full list of error codes is available at
      // https://firebase.google.com/docs/storage/web/handle-errors
      switch (error.code) {
        case 'storage/unauthorized':
          // User doesn't have permission to access the object
          break;
        case 'storage/canceled':
          // User canceled the upload
          break;

          // ...

        case 'storage/unknown':
          // Unknown error occurred, inspect error.serverResponse
          break;
      }
    },
    () => {
      // Upload completed successfully, now we can get the download URL
      uploadTask.getDownloadURL(uploadTask.snapshot.ref).then(
        (downloadURL) => {
          console.log('File available at', downloadURL);
        }
      );
    }
  );
}

const auth = {
  getCurrentUser() {
    return firebase.auth().currentUser;
  },
  signInWithToken(token) {
    return firebase
      .auth()
      .signInWithCustomToken(token);
  }
}

const filrebaseUtils = {
  filebaseUpload,
  auth
};

export default filrebaseUtils;
