// datainside.js
import { db } from '../config/firebase'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

// Function to handle button click and add multiple podcasts to Firestore
export const handleAddPodcast = async () => {
  try {
    // Add Podcast 1
    await setDoc(doc(db, 'podcast', 'BasicToefl'), {
      Title: "BasicToefl",
      Description: "Selamat datang di BasicTOEFL Podcast, tempat belajar bahasa Inggris yang santai namun informatif! Kami membahas berbagai topik seputar TOEFL, termasuk tips belajar, strategi menjawab soal, dan latihan mendengarkan yang interaktif. Setiap episode dirancang untuk membantu Anda meningkatkan keterampilan bahasa Inggris dengan cara yang mudah dipahami dan menyenangkan. Cocok untuk pemula hingga level menengah yang ingin meningkatkan skor TOEFL mereka. Belajar TOEFL jadi lebih mudah, kapan saja dan di mana saja!",
      CategoryID: "1",
      ImageURL: "https://i.ibb.co.com/7GmY7Q7/podcast-1.png",
      SoundURL: "",
      CreatedAt: serverTimestamp(),
      Played: 0
    });

    // Add Podcast 2
    await setDoc(doc(db, 'podcast', 'BasicPublicSpeaking'), {
      Title: "Basic Public Speaking",
      Description: "Selamat datang di Basic Public Speaking Podcast, tempat Anda belajar seni berbicara di depan umum dengan percaya diri dan efektif! Kami membahas teknik berbicara, tips mengatasi gugup, dan cara menyampaikan pesan yang kuat dan persuasif. Setiap episode dirancang untuk pemula hingga profesional yang ingin meningkatkan keterampilan komunikasi mereka. Bersiaplah untuk menjadi pembicara yang lebih percaya diri dan menginspirasi!",
      CategoryID: "1",
      ImageURL: "https://i.ibb.co.com/0Jm7jHL/podcast-2.png",
      SoundURL: "",
      CreatedAt: serverTimestamp(),
      Played: 0
    });

    // Add Podcast 3
    await setDoc(doc(db, 'podcast', 'StrategiBeasiswa'), {
      Title: "Strategi Beasiswa",
      Description: "Selamat datang di Strategi Beasiswa Podcast, panduan lengkap untuk meraih beasiswa impian Anda! Kami membahas tips mencari beasiswa, cara membuat esai yang kuat, mempersiapkan wawancara, dan strategi sukses lainnya. Dapatkan informasi terkini dan inspirasi dari para penerima beasiswa yang telah berhasil mewujudkan mimpi mereka. Bersama, kita wujudkan impian pendidikan tanpa batas!",
      CategoryID: "2",
      ImageURL: "https://i.ibb.co.com/y8RLhHL/podcast-3.png",
      SoundURL: "",
      CreatedAt: serverTimestamp(),
      Played: 0
    });

    // Add Podcast 4
    await setDoc(doc(db, 'podcast', 'PertanyaanWawancara'), {
      Title: "Pertanyaan Wawancara",
      Description: "Selamat datang di Pertanyaan Wawancara Podcast, tempat Anda belajar menghadapi pertanyaan yang sering muncul dalam wawancara beasiswa! Kami membahas teknik menjawab, tips mengatasi gugup, dan cara menyampaikan pesan yang kuat dan persuasif. Setiap episode dirancang untuk pemula hingga profesional yang ingin meningkatkan keterampilan komunikasi mereka. Bersiaplah untuk menjadi pembicara yang lebih percaya diri dan menginspirasi!",
      CategoryID: "2",
      ImageURL: "https://i.ibb.co.com/M1P9ShK/podcast-4.png",
      SoundURL: "",
      CreatedAt: serverTimestamp(),
      Played: 0
    });

    // Add Podcast 5
    await setDoc(doc(db, 'podcast', 'JLPTN5'), {
      Title: "JLPT N5",
      Description: "Selamat datang di JLPT N5 Podcast, tempat Anda belajar bahasa Jepang yang santai namun informatif! Kami membahas berbagai topik seputar JLPT, termasuk tips belajar, strategi menjawab soal, dan latihan mendengarkan yang interaktif. Setiap episode dirancang untuk membantu Anda meningkatkan keterampilan bahasa Jepang dengan cara yang mudah dipahami dan menyenangkan. Cocok untuk pemula hingga level menengah yang ingin meningkatkan skor JLPT mereka. Belajar JLPT jadi lebih mudah, kapan saja dan di mana saja!",
      CategoryID: "1",
      ImageURL: "https://i.ibb.co.com/Vvs3W95/podcast-5.png",
      SoundURL: "",
      CreatedAt: serverTimestamp(),
      Played: 0
    });

    // Add Podcast 6
    await setDoc(doc(db, 'podcast', 'BasicJapaneseConversation'), {
      Title: "Basic Japanese Conversation",
      Description: "Selamat datang di Basic Japanese Conversation Podcast, tempat belajar percakapan bahasa Jepang dengan cara yang mudah dan menyenangkan! Kami membahas frasa sehari-hari, kosakata penting, dan budaya Jepang untuk membantu Anda berbicara lebih percaya diri. Cocok untuk pemula yang ingin memulai perjalanan belajar bahasa Jepang.",
      CategoryID: "1",
      ImageURL: "https://i.ibb.co.com/JcV0yyR/human-studying-cartoon.png",
      SoundURL: "",
      CreatedAt: serverTimestamp(),
      Played: 0
    });

    console.log('All podcasts added successfully!');
  } catch (error) {
    console.error('Error adding podcasts: ', error);
  }
};
