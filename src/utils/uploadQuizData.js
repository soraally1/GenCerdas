import { setDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebase'; // Import db directly from firebase config

// Course titles mapping
const courseTitles = {
  1: "Persiapan Dokumen",
  2: "Essay Writing",
  3: "Interview Skills",
  4: "IELTS Preparation",
  5: "TOEFL Preparation",
  6: "Research Proposal",
  7: "Statement of Purpose",
  8: "Motivation Letter",
  9: "Basic Japanese",
  10: "Intermediate Japanese",
  11: "Advanced Japanese",
  12: "Japanese Writing",
  13: "Japanese Speaking",
  14: "Japanese Reading",
  15: "Japanese Research Writing",
  16: "Japanese Interview Skills",
  17: "Persiapan Bahasa Mandarin",
  18: "HSK Preparation",
  19: "Chinese Academic Writing", 
  20: "Chinese Interview Skills",
  21: "Persiapan Bahasa Korea",
  22: "TOPIK Preparation",
  23: "Korean Academic Writing",
  24: "Korean Interview Skills",
  25: "Scholarship Network Building"
};

// Function to upload quiz data to Firestore
const uploadQuizData = async () => {
  try {
    for (const [courseId, questions] of Object.entries(quizData)) {
      const courseTitle = courseTitles[courseId];
      
      // Create a document for each course
      await setDoc(doc(db, 'quizzes', courseTitle), {
        courseId: parseInt(courseId),
        title: courseTitle,
        questions: questions
      });

      console.log(`Uploaded quiz data for ${courseTitle}`);
    }
    console.log('All quiz data uploaded successfully');
  } catch (error) {
    console.error('Error uploading quiz data:', error);
    throw error; // Re-throw the error to be handled by the component
  }
};

// The quiz data structure
const quizData = {
  1: [ // Persiapan Dokumen
    {
      type: 'multipleChoice',
      question: "Dokumen apa yang paling penting dalam aplikasi beasiswa?",
      options: [
        "Ijazah dan Transkrip",
        "Foto dan KTP",
        "Surat Rekomendasi",
        "Media Sosial"
      ],
      correctAnswer: 0,
      explanation: "Ijazah dan transkrip adalah dokumen fundamental yang menunjukkan kualifikasi akademik Anda."
    },
    {
      type: 'trueFalse',
      question: "Benar atau Salah?",
      statement: "Surat rekomendasi harus selalu dari profesor universitas",
      correctAnswer: false,
      explanation: "Surat rekomendasi bisa dari berbagai sumber yang relevan, termasuk supervisor kerja atau mentor."
    },
    {
      type: 'multipleChoice',
      question: "Berapa salinan dokumen yang sebaiknya disiapkan?",
      options: [
        "1 salinan",
        "2 salinan",
        "3 salinan",
        "4 salinan"
      ],
      correctAnswer: 2,
      explanation: "3 salinan direkomendasikan: 1 untuk arsip, 1 untuk aplikasi, 1 cadangan."
    },
    {
      type: 'multipleChoice',
      question: "Apa format yang tepat untuk CV beasiswa?",
      options: [
        "CV Kreatif dengan banyak gambar",
        "CV Akademik dengan fokus prestasi",
        "CV Kerja dengan pengalaman profesional",
        "CV Singkat 1 halaman"
      ],
      correctAnswer: 1,
      explanation: "CV Akademik lebih sesuai untuk aplikasi beasiswa karena menekankan prestasi akademik dan penelitian."
    },
    {
      type: 'multipleChoice',
      question: "Dokumen apa yang perlu diterjemahkan?",
      options: [
        "Hanya ijazah",
        "Hanya transkrip",
        "Semua dokumen resmi",
        "Tidak perlu terjemahan"
      ],
      correctAnswer: 2,
      explanation: "Semua dokumen resmi harus diterjemahkan ke bahasa yang diminta oleh institusi tujuan."
    }
  ],

  2: [ // Essay Writing
    {
      type: 'multipleChoice',
      question: "Apa yang harus ada di paragraf pembuka essay?",
      options: [
        "Kesimpulan",
        "Hook dan thesis statement",
        "Data statistik saja",
        "Daftar prestasi"
      ],
      correctAnswer: 1,
      explanation: "Hook menarik perhatian pembaca dan thesis statement menjelaskan inti essay."
    },
    {
      type: 'trueFalse',
      question: "Benar atau Salah?",
      statement: "Essay beasiswa harus selalu fokus pada prestasi akademik saja",
      correctAnswer: false,
      explanation: "Essay yang baik mencakup berbagai aspek termasuk pengalaman personal dan aspirasi."
    },
    {
      type: 'multipleChoice',
      question: "Berapa kata ideal untuk essay beasiswa?",
      options: [
        "100-200 kata",
        "300-500 kata",
        "500-800 kata",
        "1000+ kata"
      ],
      correctAnswer: 2,
      explanation: "500-800 kata memberikan ruang cukup untuk menjelaskan detail penting tanpa bertele-tele."
    },
    {
      type: 'multipleChoice',
      question: "Apa yang sebaiknya dihindari dalam essay?",
      options: [
        "Pengalaman pribadi",
        "Data konkret",
        "Kalimat klise",
        "Rencana studi"
      ],
      correctAnswer: 2,
      explanation: "Kalimat klise membuat essay terkesan tidak original dan kurang menarik."
    },
    {
      type: 'multipleChoice',
      question: "Bagaimana mengakhiri essay yang baik?",
      options: [
        "Dengan ringkasan",
        "Dengan quotes",
        "Dengan doa",
        "Dengan call to action"
      ],
      correctAnswer: 0,
      explanation: "Ringkasan yang kuat membantu pembaca mengingat poin-poin penting essay Anda."
    }
  ],

  3: [ // Interview Skills
    {
      type: 'multipleChoice',
      question: "Apa yang harus dilakukan sebelum wawancara?",
      options: [
        "Riset tentang program",
        "Tidur seharian",
        "Bermain game",
        "Menonton TV"
      ],
      correctAnswer: 0,
      explanation: "Riset mendalam tentang program beasiswa menunjukkan keseriusan dan persiapan yang baik."
    },
    {
      type: 'trueFalse',
      question: "Benar atau Salah?",
      statement: "Terlambat 5 menit masih dapat ditoleransi dalam wawancara beasiswa",
      correctAnswer: false,
      explanation: "Ketepatan waktu sangat penting dan menunjukkan profesionalisme Anda."
    },
    {
      type: 'multipleChoice',
      question: "Bagaimana menjawab pertanyaan sulit?",
      options: [
        "Diam saja",
        "Berbohong",
        "Jujur dan terstruktur",
        "Mengalihkan topik"
      ],
      correctAnswer: 2,
      explanation: "Kejujuran dan jawaban terstruktur menunjukkan integritas dan kemampuan berpikir."
    },
    {
      type: 'multipleChoice',
      question: "Pakaian yang tepat untuk wawancara?",
      options: [
        "Casual",
        "Business formal",
        "Business casual",
        "Santai"
      ],
      correctAnswer: 1,
      explanation: "Business formal menunjukkan profesionalisme dan keseriusan Anda."
    },
    {
      type: 'multipleChoice',
      question: "Apa yang harus dibawa saat wawancara?",
      options: [
        "Hanya diri sendiri",
        "Dokumen lengkap",
        "Makanan dan minuman",
        "Teman"
      ],
      correctAnswer: 1,
      explanation: "Membawa dokumen lengkap menunjukkan kesiapan dan organisasi yang baik."
    }
  ],

  4: [ // IELTS Preparation
    {
      type: 'multipleChoice',
      question: "Berapa skor minimum IELTS untuk kebanyakan beasiswa?",
      options: [
        "5.0",
        "6.0",
        "6.5",
        "7.0"
      ],
      correctAnswer: 2,
      explanation: "Kebanyakan beasiswa mensyaratkan minimal IELTS 6.5."
    },
    {
      type: 'multipleChoice',
      question: "Bagian mana yang paling membutuhkan latihan intensif?",
      options: [
        "Listening",
        "Reading",
        "Writing",
        "Speaking"
      ],
      correctAnswer: 2,
      explanation: "Writing membutuhkan latihan paling intensif karena kompleksitas dan format spesifiknya."
    },
    {
      type: 'multipleChoice',
      question: "Berapa lama waktu ideal persiapan IELTS?",
      options: [
        "1 minggu",
        "1 bulan",
        "3 bulan",
        "6 bulan"
      ],
      correctAnswer: 2,
      explanation: "3 bulan memberikan waktu cukup untuk persiapan menyeluruh."
    },
    {
      type: 'trueFalse',
      question: "Benar atau Salah?",
      statement: "IELTS Academic dan General sama saja",
      correctAnswer: false,
      explanation: "IELTS Academic lebih fokus pada kemampuan akademik dan diperlukan untuk studi."
    },
    {
      type: 'multipleChoice',
      question: "Strategi terbaik untuk Reading section?",
      options: [
        "Membaca kata per kata",
        "Skimming dan Scanning",
        "Menghafal vocabulary",
        "Menebak semua jawaban"
      ],
      correctAnswer: 1,
      explanation: "Skimming untuk gambaran umum dan scanning untuk detail spesifik sangat efektif."
    }
  ],

  5: [ // TOEFL Preparation
    {
      type: 'multipleChoice',
      question: "Berapa skor TOEFL minimum untuk S2?",
      options: [
        "70",
        "80",
        "90",
        "100"
      ],
      correctAnswer: 2,
      explanation: "Skor 90 adalah standar minimum umum untuk program S2."
    },
    {
      type: 'multipleChoice',
      question: "Perbedaan utama TOEFL iBT dengan PBT?",
      options: [
        "Harga tes",
        "Lokasi tes",
        "Format tes",
        "Waktu tes"
      ],
      correctAnswer: 2,
      explanation: "Format tes berbeda signifikan: iBT berbasis internet dengan integrated tasks."
    },
    {
      type: 'trueFalse',
      question: "Benar atau Salah?",
      statement: "TOEFL lebih mudah dari IELTS",
      correctAnswer: false,
      explanation: "Keduanya memiliki tingkat kesulitan berbeda dan tidak bisa dibandingkan langsung."
    },
    {
      type: 'multipleChoice',
      question: "Bagian tersulit dalam TOEFL?",
      options: [
        "Reading",
        "Listening",
        "Speaking",
        "Writing"
      ],
      correctAnswer: 2,
      explanation: "Speaking sering dianggap tersulit karena waktu terbatas dan format terintegrasi."
    },
    {
      type: 'multipleChoice',
      question: "Strategi terbaik untuk Integrated Writing?",
      options: [
        "Fokus pada reading saja",
        "Fokus pada listening saja",
        "Mengintegrasikan keduanya",
        "Menulis opini pribadi"
      ],
      correctAnswer: 2,
      explanation: "Mengintegrasikan informasi dari reading dan listening adalah kunci."
    }
  ],

  6: [ // Research Proposal
    {
      type: 'multipleChoice',
      question: "Apa komponen penting dalam research proposal?",
      options: [
        "Latar belakang saja",
        "Metodologi saja",
        "Background, Objectives, Methodology",
        "Hanya hasil penelitian"
      ],
      correctAnswer: 2,
      explanation: "Proposal lengkap harus mencakup latar belakang, tujuan, dan metodologi."
    },
    {
      type: 'trueFalse',
      question: "Benar atau Salah?",
      statement: "Literature review tidak penting dalam proposal",
      correctAnswer: false,
      explanation: "Literature review sangat penting untuk menunjukkan pemahaman bidang penelitian."
    },
    {
      type: 'multipleChoice',
      question: "Berapa halaman ideal untuk proposal?",
      options: [
        "1-2 halaman",
        "3-5 halaman",
        "10-15 halaman",
        "20+ halaman"
      ],
      correctAnswer: 1,
      explanation: "3-5 halaman cukup untuk menjelaskan komponen penting proposal."
    },
    {
      type: 'multipleChoice',
      question: "Bagaimana menulis research objectives?",
      options: [
        "Sangat umum",
        "Spesifik dan terukur",
        "Abstrak",
        "Tanpa target"
      ],
      correctAnswer: 1,
      explanation: "Objectives harus SMART: Specific, Measurable, Achievable, Relevant, Time-bound."
    },
    {
      type: 'multipleChoice',
      question: "Apa yang harus ada di methodology?",
      options: [
        "Hanya teori",
        "Hanya data",
        "Detailed research plan",
        "Hasil yang diharapkan"
      ],
      correctAnswer: 2,
      explanation: "Methodology harus menjelaskan rencana penelitian secara detail dan sistematis."
    }
  ],

  7: [ // Statement of Purpose
    {
      type: 'multipleChoice',
      question: "Apa fokus utama SoP?",
      options: [
        "Cerita masa kecil",
        "Tujuan akademik",
        "Hobi",
        "Kehidupan sosial"
      ],
      correctAnswer: 1,
      explanation: "SoP harus fokus pada tujuan akademik dan rencana karir."
    },
    {
      type: 'trueFalse',
      question: "Benar atau Salah?",
      statement: "SoP boleh menceritakan seluruh pengalaman hidup",
      correctAnswer: false,
      explanation: "SoP harus fokus pada pengalaman relevan dengan program yang dituju."
    },
    {
      type: 'multipleChoice',
      question: "Berapa panjang ideal SoP?",
      options: [
        "1 paragraf",
        "1-2 halaman",
        "5 halaman",
        "10 halaman"
      ],
      correctAnswer: 1,
      explanation: "1-2 halaman cukup untuk menjelaskan tujuan dan kualifikasi."
    },
    {
      type: 'multipleChoice',
      question: "Bagaimana mengakhiri SoP?",
      options: [
        "Dengan doa",
        "Dengan quotes",
        "Dengan future goals",
        "Dengan ucapan terima kasih"
      ],
      correctAnswer: 2,
      explanation: "Future goals menunjukkan visi jelas dan komitmen."
    },
    {
      type: 'multipleChoice',
      question: "Apa yang harus dihindari dalam SoP?",
      options: [
        "Pengalaman relevan",
        "Prestasi akademik",
        "Informasi pribadi berlebihan",
        "Rencana studi"
      ],
      correctAnswer: 2,
      explanation: "Hindari informasi pribadi yang tidak relevan dengan program."
    }
  ],

  8: [ // Motivation Letter
    {
      type: 'multipleChoice',
      question: "Perbedaan Motivation Letter dengan SoP?",
      options: [
        "Tidak ada perbedaan",
        "Lebih personal",
        "Lebih formal",
        "Lebih panjang"
      ],
      correctAnswer: 1,
      explanation: "Motivation Letter lebih menekankan aspek personal dan motivasi."
    },
    {
      type: 'trueFalse',
      question: "Benar atau Salah?",
      statement: "Motivation Letter harus sangat formal",
      correctAnswer: false,
      explanation: "Bisa lebih personal namun tetap profesional."
    },
    {
      type: 'multipleChoice',
      question: "Apa yang harus ditonjolkan?",
      options: [
        "Hanya prestasi",
        "Hanya pengalaman",
        "Motivasi dan passion",
        "Hanya rencana"
      ],
      correctAnswer: 2,
      explanation: "Motivasi dan passion pribadi harus menjadi fokus utama."
    },
    {
      type: 'multipleChoice',
      question: "Format penulisan yang tepat?",
      options: [
        "Seperti diary",
        "Seperti essay formal",
        "Seperti surat profesional",
        "Seperti artikel"
      ],
      correctAnswer: 2,
      explanation: "Gunakan format surat profesional dengan tone personal."
    },
    {
      type: 'multipleChoice',
      question: "Cara membuka Motivation Letter?",
      options: [
        "Dengan quotes",
        "Dengan data statistik",
        "Dengan cerita personal",
        "Dengan definisi"
      ],
      correctAnswer: 2,
      explanation: "Cerita personal yang relevan membuat pembuka lebih menarik."
    }
  ],

  9: [ // Basic Japanese
    {
      type: 'multipleChoice',
      question: "Kapan menggunakan です (desu)?",
      options: [
        "Saat berbicara dengan teman",
        "Saat berbicara formal",
        "Saat marah",
        "Tidak pernah"
      ],
      correctAnswer: 1,
      explanation: "です (desu) digunakan dalam situasi formal atau berbicara dengan orang yang dihormati."
    },
    {
      type: 'multipleChoice',
      question: "Urutan kata dasar dalam kalimat bahasa Jepang?",
      options: [
        "Subjek-Objek-Kata Kerja",
        "Kata Kerja-Subjek-Objek",
        "Subjek-Kata Kerja-Objek",
        "Objek-Subjek-Kata Kerja"
      ],
      correctAnswer: 0,
      explanation: "Struktur dasar kalimat Jepang adalah Subjek-Objek-Kata Kerja (SOV)."
    },
    {
      type: 'trueFalse',
      question: "Benar atau Salah?",
      statement: "Hiragana dan Katakana memiliki bunyi yang berbeda",
      correctAnswer: false,
      explanation: "Hiragana dan Katakana memiliki bunyi yang sama, hanya penggunaannya yang berbeda."
    },
    {
      type: 'multipleChoice',
      question: "Partikel は (wa) digunakan untuk?",
      options: [
        "Menunjukkan objek",
        "Menunjukkan subjek",
        "Menunjukkan lokasi",
        "Menunjukkan waktu"
      ],
      correctAnswer: 1,
      explanation: "は (wa) adalah partikel penanda subjek dalam kalimat."
    },
    {
      type: 'multipleChoice',
      question: "Apa fungsi partikel を (wo)?",
      options: [
        "Menandai subjek",
        "Menandai objek langsung",
        "Menunjukkan lokasi",
        "Menunjukkan kepemilikan"
      ],
      correctAnswer: 1,
      explanation: "を (wo) digunakan untuk menandai objek langsung dari kata kerja transitif."
    }
  ],

  10: [ // Intermediate Japanese
    {
      type: 'multipleChoice',
      question: "Bentuk て (te) digunakan untuk?",
      options: [
        "Menyatakan larangan",
        "Menghubungkan kalimat",
        "Menyatakan masa depan",
        "Menyatakan masa lalu"
      ],
      correctAnswer: 1,
      explanation: "Bentuk て (te) digunakan untuk menghubungkan beberapa aksi atau keadaan."
    },
    {
      type: 'multipleChoice',
      question: "Kapan menggunakan たい (tai)?",
      options: [
        "Menyatakan keinginan diri sendiri",
        "Menyatakan perintah",
        "Menyatakan larangan",
        "Menyatakan masa lalu"
      ],
      correctAnswer: 0,
      explanation: "たい (tai) digunakan untuk menyatakan keinginan pribadi."
    },
    {
      type: 'multipleChoice',
      question: "Fungsi から (kara) adalah?",
      options: [
        "Menyatakan waktu",
        "Menyatakan alasan",
        "Menyatakan tujuan",
        "Menyatakan hasil"
      ],
      correctAnswer: 1,
      explanation: "から (kara) digunakan untuk menjelaskan alasan atau sebab."
    },
    {
      type: 'trueFalse',
      question: "Benar atau Salah?",
      statement: "ない (nai) form selalu digunakan untuk membuat kalimat negatif",
      correctAnswer: false,
      explanation: "Bentuk negatif bisa juga menggunakan ません (masen) untuk bahasa formal."
    },
    {
      type: 'multipleChoice',
      question: "Perbedaan に (ni) dan で (de)?",
      options: [
        "Tidak ada perbedaan",
        "に untuk lokasi keberadaan, で untuk lokasi aktivitas",
        "に untuk waktu, で untuk tempat",
        "に untuk orang, で untuk benda"
      ],
      correctAnswer: 1,
      explanation: "に (ni) menunjukkan lokasi keberadaan, sedangkan で (de) menunjukkan lokasi aktivitas."
    }
  ],

  11: [ // Advanced Japanese
    {
      type: 'multipleChoice',
      question: "Penggunaan 敬語 (keigo) yang tepat?",
      options: [
        "Dengan teman",
        "Dengan atasan",
        "Dengan adik",
        "Dengan hewan"
      ],
      correctAnswer: 1,
      explanation: "敬語 digunakan untuk menunjukkan rasa hormat kepada atasan atau orang yang dihormati."
    },
    {
      type: 'multipleChoice',
      question: "Bentuk potensial digunakan untuk?",
      options: [
        "Menyatakan kemampuan",
        "Menyatakan perintah",
        "Menyatakan larangan",
        "Menyatakan kewajiban"
      ],
      correctAnswer: 0,
      explanation: "Bentuk potensial (可能形) digunakan untuk menyatakan kemampuan melakukan sesuatu."
    },
    {
      type: 'multipleChoice',
      question: "Kapan menggunakan 謙譲語 (kenjougo)?",
      options: [
        "Merendahkan diri sendiri",
        "Meninggikan orang lain",
        "Berbicara netral",
        "Berbicara dengan teman"
      ],
      correctAnswer: 0,
      explanation: "謙譲語 digunakan untuk merendahkan diri sendiri saat berbicara dengan orang yang dihormati."
    },
    {
      type: 'trueFalse',
      question: "Benar atau Salah?",
      statement: "尊敬語 (sonkeigo) dan 謙譲語 (kenjougo) memiliki fungsi yang sama",
      correctAnswer: false,
      explanation: "尊敬語 untuk meninggikan orang lain, 謙譲語 untuk merendahkan diri sendiri."
    },
    {
      type: 'multipleChoice',
      question: "Penggunaan 〜させていただく yang tepat?",
      options: [
        "Dengan teman dekat",
        "Dalam situasi formal",
        "Dengan anak kecil",
        "Dalam situasi santai"
      ],
      correctAnswer: 1,
      explanation: "〜させていただく adalah bentuk sangat sopan untuk meminta izin atau menyatakan akan melakukan sesuatu."
    }
  ],

  12: [ // Japanese Writing
    {
      type: 'multipleChoice',
      question: "Format email formal dalam bahasa Jepang?",
      options: [
        "Langsung ke inti",
        "Dimulai dengan salam dan perkenalan",
        "Tanpa salam",
        "Hanya isi pesan"
      ],
      correctAnswer: 1,
      explanation: "Email formal Jepang harus dimulai dengan salam dan perkenalan yang tepat."
    },
    {
      type: 'multipleChoice',
      question: "Cara menulis tanggal yang benar?",
      options: [
        "年月日",
        "日月年",
        "月日年",
        "年日月"
      ],
      correctAnswer: 0,
      explanation: "Format tanggal Jepang adalah 年月日 (tahun-bulan-tanggal)."
    },
    {
      type: 'trueFalse',
      question: "Benar atau Salah?",
      statement: "Kanji tidak penting dalam penulisan formal",
      correctAnswer: false,
      explanation: "Kanji sangat penting dalam penulisan formal untuk menunjukkan profesionalisme."
    },
    {
      type: 'multipleChoice',
      question: "Penggunaan 丁寧語 (teineigo) yang tepat?",
      options: [
        "Dalam diary",
        "Dalam email formal",
        "Dalam chat pribadi",
        "Dalam memo"
      ],
      correctAnswer: 1,
      explanation: "丁寧語 wajib digunakan dalam komunikasi formal tertulis."
    },
    {
      type: 'multipleChoice',
      question: "Cara mengakhiri email formal?",
      options: [
        "よろしくお願いします",
        "じゃあね",
        "バイバイ",
        "また会いましょう"
      ],
      correctAnswer: 0,
      explanation: "よろしくお願いします adalah penutup standar untuk email formal."
    }
  ],

  13: [ // Japanese Speaking
    {
      type: 'multipleChoice',
      question: "Salam yang tepat saat bertemu pertama kali?",
      options: [
        "こんにちは",
        "はじめまして",
        "お久しぶり",
        "また会いましょう"
      ],
      correctAnswer: 1,
      explanation: "はじめまして digunakan khusus saat pertemuan pertama."
    },
    {
      type: 'multipleChoice',
      question: "Cara menyela pembicaraan yang sopan?",
      options: [
        "ちょっと",
        "すみません",
        "待って",
        "黙って"
      ],
      correctAnswer: 1,
      explanation: "すみません adalah cara sopan untuk menyela pembicaraan."
    },
    {
      type: 'trueFalse',
      question: "Benar atau Salah?",
      statement: "Intonasi tidak penting dalam bahasa Jepang",
      correctAnswer: false,
      explanation: "Intonasi sangat penting dan dapat mengubah makna kata."
    },
    {
      type: 'multipleChoice',
      question: "Penggunaan あいづち yang tepat?",
      options: [
        "Saat berbicara",
        "Saat mendengarkan",
        "Saat menulis",
        "Saat membaca"
      ],
      correctAnswer: 1,
      explanation: "あいづち (aizuchi) digunakan untuk menunjukkan bahwa Anda mendengarkan dengan aktif."
    },
    {
      type: 'multipleChoice',
      question: "Cara menolak dengan sopan?",
      options: [
        "いいえ",
        "ちょっと難しいです",
        "だめ",
        "無理"
      ],
      correctAnswer: 1,
      explanation: "ちょっと難しいです adalah cara halus untuk menolak tanpa menyinggung."
    }
  ],

  14: [ // Japanese Reading
    {
      type: 'multipleChoice',
      question: "Strategi membaca teks panjang?",
      options: [
        "Baca kata per kata",
        "Skimming untuk ide utama",
        "Abaikan kanji",
        "Terjemahkan semua"
      ],
      correctAnswer: 1,
      explanation: "Skimming efektif untuk mendapatkan ide utama teks panjang."
    },
    {
      type: 'multipleChoice',
      question: "Cara memahami kanji baru?",
      options: [
        "Abaikan saja",
        "Lihat konteks",
        "Selalu cek kamus",
        "Tebak asal"
      ],
      correctAnswer: 1,
      explanation: "Memahami konteks dapat membantu menebak arti kanji baru."
    },
    {
      type: 'trueFalse',
      question: "Benar atau Salah?",
      statement: "Furigana selalu ada di semua teks Jepang",
      correctAnswer: false,
      explanation: "Furigana tidak selalu tersedia, terutama di teks untuk pembaca dewasa."
    },
    {
      type: 'multipleChoice',
      question: "Pendekatan terbaik untuk artikel berita?",
      options: [
        "Baca detail",
        "Baca headline dan paragraf pertama",
        "Abaikan kanji",
        "Terjemahkan semua"
      ],
      correctAnswer: 1,
      explanation: "Headline dan paragraf pertama biasanya berisi informasi penting."
    },
    {
      type: 'multipleChoice',
      question: "Cara efektif membaca 漢字熟語?",
      options: [
        "Baca per karakter",
        "Pahami kombinasi",
        "Abaikan",
        "Tebak"
      ],
      correctAnswer: 1,
      explanation: "Memahami kombinasi kanji membantu mengerti makna 漢字熟語."
    }
  ],

  15: [ // Japanese Research Writing
    {
      type: 'multipleChoice',
      question: "Format standar 研究計画書?",
      options: [
        "自己紹介のみ",
        "研究背景・目的・方法",
        "趣味と特技",
        "アルバイト経験"
      ],
      correctAnswer: 1,
      explanation: "研究計画書 harus mencakup latar belakang, tujuan, dan metodologi penelitian."
    },
    {
      type: 'trueFalse',
      question: "Benar atau Salah?",
      statement: "研究計画書 bisa ditulis dalam bahasa informal",
      correctAnswer: false,
      explanation: "研究計画書 harus ditulis dalam bahasa formal akademik."
    },
    {
      type: 'multipleChoice',
      question: "Cara menulis hipotesis yang baik?",
      options: [
        "...ではないかと考えられる",
        "...かもしれない",
        "...だと思う",
        "...だろう"
      ],
      correctAnswer: 0,
      explanation: "Gunakan ekspresi formal dan objektif untuk hipotesis penelitian."
    },
    {
      type: 'multipleChoice',
      question: "Cara mengutip penelitian sebelumnya?",
      options: [
        "「」を使用",
        "『』を使用",
        "～によると",
        "～と思われる"
      ],
      correctAnswer: 2,
      explanation: "～によると adalah cara formal untuk mengutip penelitian sebelumnya."
    },
    {
      type: 'multipleChoice',
      question: "Struktur penelitian yang tepat?",
      options: [
        "序論・本論・結論",
        "始め・中・終わり",
        "導入・展開・まとめ",
        "開始・発展・終了"
      ],
      correctAnswer: 0,
      explanation: "序論(pendahuluan)・本論(isi)・結論(kesimpulan) adalah struktur standar."
    }
  ],

  16: [ // Japanese Interview Skills
    {
      type: 'multipleChoice',
      question: "Cara menjawab 自己紹介 yang tepat?",
      options: [
        "Langsung ke prestasi",
        "Mulai dengan nama dan asal",
        "Cerita hobi",
        "Bicara tentang kelemahan"
      ],
      correctAnswer: 1,
      explanation: "Mulai dengan informasi dasar (nama, asal) sebelum detail lain."
    },
    {
      type: 'trueFalse',
      question: "Benar atau Salah?",
      statement: "Boleh menggunakan bahasa informal jika pewawancara terlihat ramah",
      correctAnswer: false,
      explanation: "Tetap gunakan bahasa formal dalam situasi wawancara apapun."
    },
    {
      type: 'multipleChoice',
      question: "Cara menjawab pertanyaan tentang kelemahan?",
      options: [
        "Mengatakan tidak punya kelemahan",
        "Menyebutkan kelemahan dan usaha memperbaiki",
        "Mengkritik sistem",
        "Mengabaikan pertanyaan"
      ],
      correctAnswer: 1,
      explanation: "Jawab dengan jujur dan tunjukkan usaha perbaikan diri."
    },
    {
      type: 'multipleChoice',
      question: "Bahasa tubuh yang tepat saat wawancara?",
      options: [
        "Santai dan bebas",
        "Tegak dan formal",
        "Bersandar ke kursi",
        "Menyilangkan tangan"
      ],
      correctAnswer: 1,
      explanation: "Postur tegak dan formal menunjukkan keseriusan dan rasa hormat."
    },
    {
      type: 'multipleChoice',
      question: "Cara mengakhiri wawancara yang baik?",
      options: [
        "ありがとうございました",
        "失礼いたします",
        "さようなら",
        "じゃあね"
      ],
      correctAnswer: 1,
      explanation: "失礼いたします adalah ungkapan formal yang tepat untuk mengakhiri wawancara."
    }
  ],

  17: [ // Persiapan Bahasa Mandarin
    {
      type: 'multipleChoice',
      question: "Apa yang paling penting dalam belajar bahasa Mandarin?",
      options: [
        "Menghafal karakter",
        "Menguasai tones",
        "Menulis kaligrafi",
        "Membaca pinyin"
      ],
      correctAnswer: 1,
      explanation: "Tones sangat penting dalam bahasa Mandarin karena dapat mengubah arti kata."
    },
    {
      type: 'trueFalse',
      question: "Benar atau Salah?",
      statement: "Pinyin tidak penting setelah menguasai karakter",
      correctAnswer: false,
      explanation: "Pinyin tetap penting untuk mempelajari kata baru dan pengucapan yang tepat."
    },
    {
      type: 'multipleChoice',
      question: "Berapa jumlah tone dalam bahasa Mandarin?",
      options: [
        "2 tone",
        "3 tone",
        "4 tone",
        "5 tone"
      ],
      correctAnswer: 3,
      explanation: "Bahasa Mandarin memiliki 4 tone dasar dan 1 neutral tone."
    },
    {
      type: 'trueFalse',
      question: "Benar atau Salah?",
      statement: "Karakter Mandarin selalu dibaca sama dalam konteks berbeda",
      correctAnswer: false,
      explanation: "Satu karakter bisa memiliki beberapa cara baca tergantung konteks."
    },
    {
      type: 'multipleChoice',
      question: "Metode belajar karakter yang efektif?",
      options: [
        "Menghafal satu per satu",
        "Belajar radikal dan komponen",
        "Mengabaikan stroke order",
        "Fokus pada pinyin saja"
      ],
      correctAnswer: 1,
      explanation: "Memahami radikal dan komponen membantu mengingat karakter baru."
    },
    {
      type: 'multipleChoice',
      question: "Cara terbaik melatih pelafalan?",
      options: [
        "Belajar sendiri",
        "Praktik dengan native speaker",
        "Menonton drama",
        "Membaca teks"
      ],
      correctAnswer: 1,
      explanation: "Praktik dengan native speaker membantu memperbaiki pelafalan dengan cepat."
    }
  ],

  18: [ // HSK Preparation
    {
      type: 'multipleChoice',
      question: "Berapa bagian dalam tes HSK?",
      options: [
        "2 bagian",
        "3 bagian",
        "4 bagian",
        "5 bagian"
      ],
      correctAnswer: 1,
      explanation: "HSK terdiri dari 3 bagian: Listening, Reading, dan Writing."
    },
    {
      type: 'trueFalse',
      question: "Benar atau Salah?",
      statement: "HSK 4 cukup untuk semua program beasiswa",
      correctAnswer: false,
      explanation: "Beberapa program mensyaratkan HSK 5 atau 6."
    },
    {
      type: 'multipleChoice',
      question: "Strategi persiapan HSK yang efektif?",
      options: [
        "Fokus reading saja",
        "Latihan seimbang semua skill",
        "Fokus listening saja",
        "Hanya menulis"
      ],
      correctAnswer: 1,
      explanation: "Persiapan seimbang untuk semua skill penting untuk hasil optimal."
    },
    {
      type: 'multipleChoice',
      question: "Waktu ideal persiapan HSK?",
      options: [
        "1 bulan",
        "3 bulan",
        "6 bulan",
        "1 tahun"
      ],
      correctAnswer: 2,
      explanation: "6 bulan memberikan waktu cukup untuk persiapan menyeluruh."
    }
  ],

  19: [ // Chinese Academic Writing
    {
      type: 'multipleChoice',
      question: "Format standar essay akademik Mandarin?",
      options: [
        "Bebas",
        "起承转合",
        "Seperti bahasa Inggris",
        "Tanpa struktur"
      ],
      correctAnswer: 1,
      explanation: "起承转合 adalah struktur standar penulisan akademik Mandarin."
    },
    {
      type: 'trueFalse',
      question: "Benar atau Salah?",
      statement: "Gaya bahasa informal bisa digunakan dalam tulisan akademik",
      correctAnswer: false,
      explanation: "Tulisan akademik harus menggunakan bahasa formal dan standar."
    },
    {
      type: 'multipleChoice',
      question: "Penggunaan referensi yang tepat?",
      options: [
        "Tidak perlu referensi",
        "Referensi dalam bahasa apapun",
        "Referensi berbahasa Mandarin",
        "Tanpa kutipan"
      ],
      correctAnswer: 2,
      explanation: "Gunakan referensi berbahasa Mandarin untuk tulisan akademik Mandarin."
    },
    {
      type: 'multipleChoice',
      question: "Cara mengutip sumber?",
      options: [
        "Bebas format",
        "Format standar Tiongkok",
        "Format APA",
        "Tanpa format"
      ],
      correctAnswer: 1,
      explanation: "Gunakan format standar Tiongkok untuk kutipan akademik."
    }
  ],

  20: [ // Chinese Interview Skills
    {
      type: 'multipleChoice',
      question: "Sapaan yang tepat untuk interviewer?",
      options: [
        "老师",
        "同学",
        "朋友",
        "你好"
      ],
      correctAnswer: 0,
      explanation: "老师 adalah sapaan formal dan hormat yang tepat."
    },
    {
      type: 'trueFalse',
      question: "Benar atau Salah?",
      statement: "Boleh menggunakan bahasa gaul dalam wawancara",
      correctAnswer: false,
      explanation: "Gunakan bahasa formal dan standar dalam wawancara."
    },
    {
      type: 'multipleChoice',
      question: "Body language yang tepat?",
      options: [
        "Santai",
        "Formal dan sopan",
        "Bebas",
        "Tidak penting"
      ],
      correctAnswer: 1,
      explanation: "Body language formal dan sopan penting dalam budaya Tiongkok."
    },
    {
      type: 'multipleChoice',
      question: "Cara menjawab pertanyaan sulit?",
      options: [
        "Diam saja",
        "Minta waktu berpikir dengan sopan",
        "Mengalihkan topik",
        "Menolak menjawab"
      ],
      correctAnswer: 1,
      explanation: "请让我想一想 adalah cara sopan meminta waktu berpikir."
    }
  ],

  21: [ // Persiapan Bahasa Korea
    {
      type: 'multipleChoice',
      question: "Level bahasa minimum untuk beasiswa Korea?",
      options: [
        "TOPIK 2",
        "TOPIK 3",
        "TOPIK 4",
        "TOPIK 5"
      ],
      correctAnswer: 2,
      explanation: "Kebanyakan beasiswa mensyaratkan minimal TOPIK 4."
    },
    {
      type: 'trueFalse',
      question: "Benar atau Salah?",
      statement: "Honorifik hanya digunakan untuk orang tua",
      correctAnswer: false,
      explanation: "Honorifik digunakan untuk semua orang yang lebih senior atau dihormati."
    },
    {
      type: 'multipleChoice',
      question: "Aspek terpenting dalam belajar bahasa Korea?",
      options: [
        "Kosakata",
        "Grammar",
        "Honorifik",
        "Pengucapan"
      ],
      correctAnswer: 2,
      explanation: "Sistem honorifik sangat penting dalam budaya Korea."
    },
    {
      type: 'multipleChoice',
      question: "Cara efektif belajar Hangul?",
      options: [
        "Menghafal",
        "Sistem kombinasi",
        "Menulis berulang",
        "Membaca saja"
      ],
      correctAnswer: 1,
      explanation: "Memahami sistem kombinasi Hangul lebih efektif daripada menghafal."
    }
  ],

  22: [ // TOPIK Preparation
    {
      type: 'multipleChoice',
      question: "Bagian tersulit dalam TOPIK?",
      options: [
        "Listening",
        "Reading",
        "Writing",
        "Speaking"
      ],
      correctAnswer: 2,
      explanation: "Writing sering dianggap paling sulit karena memerlukan penguasaan grammar dan kosakata."
    },
    {
      type: 'trueFalse',
      question: "Benar atau Salah?",
      statement: "TOPIK I cukup untuk beasiswa",
      correctAnswer: false,
      explanation: "Kebanyakan beasiswa memerlukan TOPIK II."
    },
    {
      type: 'multipleChoice',
      question: "Strategi persiapan TOPIK?",
      options: [
        "Fokus satu skill",
        "Latihan seimbang",
        "Belajar mendadak",
        "Tanpa persiapan"
      ],
      correctAnswer: 1,
      explanation: "Persiapan seimbang untuk semua skill penting untuk hasil optimal."
    },
    {
      type: 'multipleChoice',
      question: "Waktu ideal persiapan TOPIK?",
      options: [
        "1 bulan",
        "3 bulan",
        "6 bulan",
        "1 tahun"
      ],
      correctAnswer: 2,
      explanation: "6 bulan memberikan waktu cukup untuk persiapan menyeluruh."
    }
  ],

  23: [ // Korean Academic Writing
    {
      type: 'multipleChoice',
      question: "Format standar paper akademik Korea?",
      options: [
        "Bebas",
        "서론-본론-결론",
        "Tanpa format",
        "Seperti bahasa Inggris"
      ],
      correctAnswer: 1,
      explanation: "서론-본론-결론 adalah struktur standar paper akademik Korea."
    },
    {
      type: 'trueFalse',
      question: "Benar atau Salah?",
      statement: "Bahasa informal bisa digunakan dalam tulisan akademik",
      correctAnswer: false,
      explanation: "Tulisan akademik harus menggunakan bahasa formal akademik."
    },
    {
      type: 'multipleChoice',
      question: "Penggunaan honorifik dalam tulisan akademik?",
      options: [
        "Tidak perlu",
        "Wajib",
        "Tergantung konteks",
        "Bebas"
      ],
      correctAnswer: 2,
      explanation: "Penggunaan honorifik tergantung konteks dan jenis tulisan."
    },
    {
      type: 'multipleChoice',
      question: "Cara mengutip sumber dalam bahasa Korea?",
      options: [
        "Format bebas",
        "Format Korea",
        "Format APA",
        "Tanpa format"
      ],
      correctAnswer: 1,
      explanation: "Gunakan format standar Korea untuk kutipan akademik."
    }
  ],

  24: [ // Korean Interview Skills
    {
      type: 'multipleChoice',
      question: "Sapaan yang tepat untuk interviewer?",
      options: [
        "선생님",
        "친구",
        "너",
        "아저씨"
      ],
      correctAnswer: 0,
      explanation: "선생님 adalah sapaan formal dan hormat yang tepat."
    },
    {
      type: 'trueFalse',
      question: "Benar atau Salah?",
      statement: "Kontak mata langsung selalu baik",
      correctAnswer: false,
      explanation: "Dalam budaya Korea, kontak mata berlebihan bisa dianggap tidak sopan."
    },
    {
      type: 'multipleChoice',
      question: "Cara menjawab pertanyaan personal?",
      options: [
        "Jujur langsung",
        "Sopan dan diplomatis",
        "Menghindar",
        "Berbohong"
      ],
      correctAnswer: 1,
      explanation: "Jawab dengan sopan dan diplomatis sambil tetap jujur."
    },
    {
      type: 'multipleChoice',
      question: "Body language yang tepat?",
      options: [
        "Santai",
        "Formal dan sopan",
        "Bebas",
        "Tidak penting"
      ],
      correctAnswer: 1,
      explanation: "Body language formal dan sopan sangat penting dalam budaya Korea."
    }
  ],

  25: [ // Scholarship Network Building
    {
      type: 'multipleChoice',
      question: "Platform networking yang efektif?",
      options: [
        "Social media pribadi",
        "LinkedIn dan ResearchGate",
        "Game online",
        "Chat casual"
      ],
      correctAnswer: 1,
      explanation: "Platform profesional lebih efektif untuk networking akademik."
    },
    {
      type: 'trueFalse',
      question: "Benar atau Salah?",
      statement: "Networking hanya penting saat mencari beasiswa",
      correctAnswer: false,
      explanation: "Networking penting untuk jangka panjang, tidak hanya saat mencari beasiswa."
    },
    {
      type: 'multipleChoice',
      question: "Cara approach profesor potensial?",
      options: [
        "Email casual",
        "Email formal dengan proposal",
        "Direct message media sosial",
        "Telepon langsung"
      ],
      correctAnswer: 1,
      explanation: "Email formal dengan proposal menunjukkan profesionalisme dan keseriusan."
    },
    {
      type: 'multipleChoice',
      question: "Follow-up yang tepat?",
      options: [
        "Setiap hari",
        "Tidak perlu",
        "1-2 minggu",
        "6 bulan"
      ],
      correctAnswer: 2,
      explanation: "Follow-up setelah 1-2 minggu adalah waktu yang tepat dan profesional."
    }
  ]
};

export { uploadQuizData, courseTitles };
