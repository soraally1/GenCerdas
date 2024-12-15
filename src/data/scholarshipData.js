import MEXT from "../assets/beasiswa/MEXT.png";
import LPDP from "../assets/beasiswa/LPDP.png";
import BI from "../assets/beasiswa/BI.png";

export const scholarshipData = [
  {
    id: "mext-2024",
    title: "Beasiswa MEXT 2024",
    provider: "Pemerintah Jepang",
    description: "Program beasiswa dari pemerintah Jepang untuk mahasiswa internasional yang ingin melanjutkan studi S1/S2/S3 di Jepang dengan tanggungan biaya penuh dan tunjangan hidup.",
    value: "Biaya kuliah penuh + ¥117.000-¥147.000 per bulan",
    deadline: "15 Mei 2024",
    requirements: [
      "Usia di bawah 35 tahun",
      "IPK minimal 3,0/4,0",
      "Kemampuan bahasa Jepang atau Inggris yang baik",
      "Ijazah S1 (untuk program S2)",
      "Ijazah S2 (untuk program S3)",
      "Proposal penelitian yang kuat"
    ],
    benefits: [
      "Biaya kuliah ditanggung penuh",
      "Tunjangan bulanan",
      "Tiket pesawat pulang-pergi",
      "Pelatihan bahasa Jepang selama 6 bulan",
      "Asuransi kesehatan"
    ],
    category: "internasional",
    status: "buka",
    image: MEXT,
    website: "https://www.mext.go.jp/en/policy/education/highered/title02/detail02/1373897.htm"
  },
  {
    id: "lpdp-2024",
    title: "Beasiswa LPDP 2024",
    provider: "Pemerintah Indonesia",
    description: "Beasiswa prestisius dari pemerintah untuk warga negara Indonesia yang ingin melanjutkan studi S2 atau S3 baik di dalam maupun luar negeri.",
    value: "Pendanaan penuh hingga $50.000/tahun",
    deadline: "30 April 2024",
    requirements: [
      "Warga Negara Indonesia",
      "Usia maksimal 35 tahun (S2) / 40 tahun (S3)",
      "IPK minimal 3,0/4,0",
      "IELTS 6,5 atau TOEFL iBT 80",
      "Surat penerimaan dari universitas tujuan",
      "Komitmen kembali ke Indonesia"
    ],
    benefits: [
      "Biaya kuliah ditanggung penuh",
      "Tunjangan hidup bulanan",
      "Tunjangan penelitian",
      "Tunjangan buku",
      "Asuransi perjalanan",
      "Tunjangan kedatangan"
    ],
    category: "pemerintah",
    status: "buka",
    image: LPDP,
    website: "https://lpdp.kemenkeu.go.id"
  },
  {
    id: "bi-2024",
    title: "Beasiswa Bank Indonesia 2024",
    provider: "Bank Indonesia",
    description: "Program beasiswa bergengsi dari Bank Indonesia untuk mahasiswa berprestasi di bidang ekonomi, perbankan, dan keuangan.",
    value: "Biaya kuliah penuh + tunjangan bulanan",
    deadline: "15 April 2024",
    requirements: [
      "Warga Negara Indonesia",
      "Usia maksimal 23 tahun",
      "IPK minimal 3,25",
      "Jurusan Ekonomi/Perbankan/Keuangan",
      "Mahasiswa aktif semester 4-6",
      "Memiliki prestasi akademik yang baik"
    ],
    benefits: [
      "Biaya kuliah ditanggung penuh",
      "Tunjangan hidup bulanan",
      "Dana penelitian",
      "Tunjangan buku",
      "Pengembangan profesional",
      "Kesempatan magang"
    ],
    category: "pemerintah",
    status: "buka",
    image: BI,
    website: "https://www.bi.go.id/id/institute/beasiswa/"
  }
]; 