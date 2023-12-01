const admin = require("firebase-admin");
const serviceAccount = require("./imedia-admin.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "gs://infinity-media-b1f68.appspot.com",
});

const bucket = admin.storage().bucket();

const uploadFile = async (file, folder) => {
  // const bucket = admin.storage().bucket();

  const rand = Math.random();

  const fileBuffer = file.buffer;
  const filePath = `${folder}/imedia-${rand}-${file.originalname}`;

  try {
    const fileRef = bucket.file(filePath);
    await fileRef.save(fileBuffer);

    const publicUrl = await fileRef.getSignedUrl({
      action: "read",
      expires: "03-01-2500",
    });

    return publicUrl[0];
  } catch (error) {
    throw new Error(error.message);
  }
};

const deleteFile = async (filePath) => {
  try {
    const exist = await bucket.file(filePath).exists();
    console.log(exist);
    // const deleted = await admin.storage().bucket(storageBucketName).file(filePath).delete();
    const deleted = await admin.storage().bucket().file(filePath).delete();
    // const deleted = await bucket.deleteFiles({
    //   prefix: filePath,
    // });
    return deleted;
  } catch (error) {
    throw new Error(error.message);
  }
};


exports.uploadFile = uploadFile;
exports.deleteFile = deleteFile;

// const uploadFile = async (file, folder) => {

//   const rand = Math.random();
//   const filePath = `${folder}/imedia-${rand}-${file.originalname}`;
//   try {
//     const fileUploadStream = bucket.file(filePath).createWriteStream();

//     fileUploadStream.end(file.buffer);

//     await new Promise((resolve, reject) => {
//       fileUploadStream.on("finish", () => resolve());
//       fileUploadStream.on("error", (error) => reject(error));
//     });

//     const downloadURL = `http://storage.googleapis.com/${bucket.name}/${filePath}`;
//     console.log(downloadURL);
//     return downloadURL;
//   } catch (error) {
//     throw new Error(error.message);
//   }
// };

// const admin = require("firebase-admin");
// const { Storage } = require("@google-cloud/storage");

// // Initialize the Firebase Admin SDK
// const serviceAccount = require("./imedia-admin.json");

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });

// // Initialize the Cloud Storage client
// const storage = new Storage();

// const bucketName = "infinity-media-b1f68.appspot.com";

// // Function to generate a signed URL for a Firebase file
// const uploadFile = async (file, folder) => {
//   const rand = Math.random();
//   const filePath = `${folder}/imedia-${rand}-${file.originalname}`;

//   const options = {
//     version: "v4",
//     action: "read",
//     expires: Date.now() + 15 * 60 * 1000,
//     // expires: "03-01-2500",
//   };

//   // Generate a signed URL
//   const [url] = await storage
//     .bucket(bucketName)
//     .file(filePath)
//     .getSignedUrl(options);

//   console.log(url);

//   return url;
// };

// exports.uploadFile = uploadFile;
// Usage example
// const bucketName = "your-bucket-name";
// const fileName = "your-file-name";

// getSignedUrl(bucketName, fileName)
//   .then((url) => {
//     console.log(`Access the file here: ${url}`);
//   })
//   .catch((err) => {
//     console.error("Error generating signed URL:", err);
//   });

// const admin = require("firebase-admin");
// const serviceAccount = require("./imedia-admin.json");

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   storageBucket: "gs://infinity-media-b1f68.appspot.com",
// });

// const uploadFile = async (file, folder) => {
//   const bucket = admin.storage().bucket();

//   const rand = Math.random();

//   const fileBuffer = file.buffer;
//   const filePath = `${folder}/imedia-${rand}-${file.originalname}`;

//   try {
//     const fileRef = bucket.file(filePath);
//     await fileRef.save(fileBuffer);

//     const publicUrl = await fileRef.getSignedUrl({
//       action: "read",
//       expires: "03-01-2500",
//     });

//     return publicUrl[0];

//     // console.log(publicUrl[0]);
//   } catch (error) {
//     throw new Error(error.message);
//   }
// };

// const deleteFile = async (filePath) => {
//   try {
//     // const deleted = await admin.storage().bucket(storageBucketName).file(filePath).delete();
//     const deleted = await admin.storage().bucket().file(filePath).delete()
//     return deleted;
//   } catch (error) {
//     throw new Error(error.message);
//   }
// };

// exports.uploadFile = uploadFile;
// exports.deleteFile = deleteFile;

// const app = require("./firebaseConfig");
// const {
//   getStorage,
//   ref,
//   uploadBytesResumable,
//   getDownloadURL,
// } = require("firebase/storage");

// const uploadFile = async (file, folder) => {
//   try {
//     const metadata = {
//       contentType: file.mimetype,
//     };
//     const storage = getStorage(app);
//     const rand = Math.random();
//     const filename = `imedia-${rand}-${file.originalname}`;
//     const storageRef = ref(storage, `${folder}/${filename}`);
//     const uploadTask = uploadBytesResumable(storageRef, file.buffer, metadata);
//     uploadTask.on(
//       "state_changed",
//       (snapshot) => {
//         const progress =
//           (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
//         // console.log("Upload is " + progress + "% done");
//         // switch (snapshot.state) {
//         //   case "paused":
//         //     console.log("Upload is paused");
//         //     break;
//         //   case "running":
//         //     console.log("Upload is running");
//         //     break;
//         //   default:
//         //     break;
//         // }
//       },
//       (error) => {
//         // Handle unsuccessful uploads/
//         // console.log(error);
//         throw new Error({ Error: error.message });
//       },
//       async () => {
//         // Handle successful uploads on complete
//         // For instance, get the download URL: https://firebasestorage.googleapis.com/...
//         const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
//         return downloadURL;
//       }
//     );
//   } catch (error) {
//     console.log(error);
//   }
// };

// exports.uploadFile = uploadFile;

// const admin = require("firebase-admin");
// const serviceAccount = require("./imedia-admin.json");

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   storageBucket: "gs://infinity-media-b1f68.appspot.com",
// });

// const uploadFile = async (file, folder) => {
//   const bucket = admin.storage().bucket();

//   const rand = Math.random();

//   const fileBuffer = file.buffer;
//   const filePath = `${folder}/imedia-${rand}-${file.originalname}`;

//   try {
//     const fileRef = bucket.file(filePath);
//     await fileRef.save(fileBuffer);

//     const publicUrl = await fileRef.getSignedUrl({
//       action: "read",
//       expires: "03-01-2500",
//     });

//     return publicUrl[0];

//     // console.log(publicUrl[0]);
//   } catch (error) {
//     throw new Error(error.message);
//   }
// };

// const deleteFile = async (filePath) => {
//   try {
//     // const deleted = await admin.storage().bucket(storageBucketName).file(filePath).delete();
//     const deleted = await admin.storage().bucket().file(filePath).delete()
//     return deleted;
//   } catch (error) {
//     throw new Error(error.message);
//   }
// };

// exports.uploadFile = uploadFile;
// exports.deleteFile = deleteFile;

// const admin = require("firebase-admin");
// const serviceAccount = require("./imedia-admin.json");

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   storageBucket: "gs://infinity-media-b1f68.appspot.com",
// });

// const uploadFile = async (file, folder) => {
//   const bucket = admin.storage().bucket();

//   const rand = Math.random();

//   const fileBuffer = file.buffer;
//   const filePath = `${folder}/${rand}-${file.originalname}`;

//   try {
//     const blob = bucket.file(filePath);
//     const blobStream = blob.createWriteStream();

//     blobStream.on("error", (err) => {
//       console.error(err);
//     });

//     blobStream.on("finish", () => {
//       const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
//       console.log(publicUrl);
//       return publicUrl;
//     });

//     blobStream.end(file.buffer);
//   } catch (error) {
//     console.log(error);
//   }
// };

// exports.uploadFile = uploadFile;

// await bucket.file(filePath).put(fileBuffer);
// const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;

// console.log(publicUrl);
