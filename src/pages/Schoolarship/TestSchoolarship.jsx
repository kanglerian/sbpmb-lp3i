import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "./Navbar.jsx";
import axios from "axios";

import CointSound from '../../assets/sounds/coin.mp3';
import GameOverSound from '../../assets/sounds/gameover.mp3';
import WinSound from '../../assets/sounds/win.mp3';
import Loading from "../../components/Loading.jsx";

import { jwtDecode } from "jwt-decode";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight, faCircleCheck, faHand, faSave, faTag, faXmark } from "@fortawesome/free-solid-svg-icons";

const TestSchoolarship = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const localStorageId = localStorage.getItem("id");

  const [user, setUser] = useState({
    name: "Loading...",
  });

  const [loading, setLoading] = useState(false);

  const [errorPage, setErrorPage] = useState(false);

  const [buttonActive, setButtonActive] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!localStorageId) {
    if (state && state.id) {
      localStorage.setItem("id", state.id);
    }
  }

  const [active, setActive] = useState({});
  const [answers, setAnswers] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [records, setRecords] = useState([]);
  const [selected, setSelected] = useState(null);
  const [recordStudent, setRecordStudent] = useState(null);
  const [isUpdate, setIsUpdate] = useState(false);

  const WinSoundPlay = () => {
    let audio = new Audio(WinSound);
    audio.play();
  }

  const CointSoundPlay = () => {
    let audio = new Audio(CointSound);
    audio.play();
  }

  const getInfo = async () => {
    try {
      const token = localStorage.getItem("LP3ISBPMB:token");
      if (!token) {
        return navigate("/");
      }
      const decoded = jwtDecode(token);
      setUser(decoded.data);
      getQuestions(decoded.data.identity);
    } catch (error) {
      if (error.response) {
        if ([400, 403].includes(error.response.status)) {
          localStorage.removeItem("LP3ISBPMB:token");
          navigate("/login");
        } else {
          console.error("Unexpected HTTP error:", error);
        }
      } else if (error.request) {
        console.error("Network error:", error);
      } else {
        console.error("Error:", error);
        setErrorPage(true);
      }
      navigate("/login");
    }
  };

  const getQuestions = async (identity) => {
    setLoading(true);
    const stateId = localStorage.getItem("id");
    if (stateId) {
      const recordResponse = await axios.get(
        `https://api.politekniklp3i-tasikmalaya.ac.id/scholarship/records?identity_user=${identity}&category=${stateId}`
      );
      const questionResponse = await axios.get(
        `https://api.politekniklp3i-tasikmalaya.ac.id/scholarship/questions?category=${stateId}`
      );
      if (recordResponse.data && questionResponse.data) {
        const filterResponse = questionResponse.data.filter(
          (question) =>
            !recordResponse.data.some(
              (record) => record.question_id == question.id
            )
        ).sort(() => Math.random() - 0.5);
        if (filterResponse.length > 0) {
          let id = filterResponse[0].id;
          const answerResponse = await axios.get(
            `https://api.politekniklp3i-tasikmalaya.ac.id/scholarship/answers/question/${id}`
          );
          let bucket = localStorage.getItem("LP3ISBPMB:bucket");
          if (bucket) {
            bucket = JSON.parse(bucket);
            const answer = bucket.find((data) => data.question_id == filterResponse[0].id);
            if (answer) {
              setSelected(answer.text)
              setIsUpdate(true);
            } else {
              setSelected(null);
              setIsUpdate(false);
            }
            setRecords(bucket);
            const questionNotAnswer = filterResponse
              .filter(s => !bucket.some(j => j.question_id == s.id))
              .sort(() => Math.random() - 0.5);
            if (questionNotAnswer.length > 0) {
              const answerResponse = await axios.get(
                `https://api.politekniklp3i-tasikmalaya.ac.id/scholarship/answers/question/${questionNotAnswer[0].id}`
              );
              setActive({
                category: questionNotAnswer[0].category.name,
                question: questionNotAnswer[0].question,
              });
              setAnswers(answerResponse.data);
              setQuestions(questionNotAnswer);
              setSelected(null);
              setIsUpdate(false);
              setTimeout(() => {
                setLoading(false);
              }, 1000);
            } else {
              setAnswers([]);
              setQuestions([]);
              setActive({
                category: "Soal Sudah Selesai.",
                question: "Silahkan untuk klik selesai untuk menutup seleksi di kategori soal ini.",
              });
              setSelected(null);
              setIsUpdate(false);
              setTimeout(() => {
                setLoading(false);
              }, 1000);
            }
          } else {
            setAnswers(answerResponse.data);
            setQuestions(filterResponse);
            setActive({
              category: filterResponse[0].category.name,
              question: filterResponse[0].question,
            });
            setTimeout(() => {
              setLoading(false);
            }, 1000);
          }
        } else {
          setAnswers([]);
          setQuestions([]);
          setActive({
            category: "Soal Sudah Selesai.",
            question: "Silahkan untuk klik selesai untuk menutup seleksi di kategori soal ini.",
          });
        }
      }
    } else {
      navigate('/dashboard')
    }
  };

  const changeQuestion = async (question) => {
    setActive({
      category: question.category.name,
      question: question.question,
    });
    let bucket = localStorage.getItem("LP3ISBPMB:bucket");
    if (bucket) {
      bucket = JSON.parse(bucket);
      let answer = bucket.find((data) => data.question_id == question.id);
      if (answer) {
        setSelected(answer.text)
        setIsUpdate(true);
      } else {
        setSelected(null);
        setIsUpdate(false);
      }
    }
    await axios
      .get(`https://api.politekniklp3i-tasikmalaya.ac.id/scholarship/answers/question/${question.id}`)
      .then((response) => {
        setAnswers(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const updateQuestion = async (record) => {
    try {
      const questionResponse = await axios.get(`https://api.politekniklp3i-tasikmalaya.ac.id/scholarship/questions/${record.question_id}`);
      const answersResponse = await axios.get(`https://api.politekniklp3i-tasikmalaya.ac.id/scholarship/answers/question/${record.question_id}`);
      setActive({
        category: questionResponse.data.category.name,
        question: questionResponse.data.question,
      });
      setIsUpdate(true);
      setAnswers(answersResponse.data);
      setSelected(record.text);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setButtonActive(true);
    if (!isUpdate) {
      setSelected(null);
    }
    const question = e.target.getAttribute("data-question");
    const category = e.target.getAttribute("data-category");
    const text = e.target.getAttribute("data-text");
    const answer = e.target.value;
    setRecordStudent({
      identity_user: user.identity,
      category_id: parseInt(category),
      question_id: parseInt(question),
      answer_id: parseInt(answer),
      text: text,
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    let bucket = localStorage.getItem("LP3ISBPMB:bucket") || "[]";
    bucket = JSON.parse(bucket);
    if (recordStudent) {
      if (isUpdate) {
        const index = bucket.findIndex((data) => data.question_id == recordStudent.question_id);
        if (index !== -1) {
          bucket[index].answer_id = recordStudent.answer_id;
          bucket[index].text = recordStudent.text;
          localStorage.setItem("LP3ISBPMB:bucket", JSON.stringify(bucket));
        }
      } else {
        bucket.push(recordStudent);
        localStorage.setItem("LP3ISBPMB:bucket", JSON.stringify(bucket));
      }
    }
    CointSoundPlay();
    getQuestions(user.identity);
    setSelected(null);
    setTimeout(() => {
      setLoading(false);
    }, 5000);
  }

  useEffect(() => {
    const bucket = localStorage.getItem("LP3ISBPMB:bucket");
    if (bucket) {
      const parsedData = JSON.parse(bucket);
      setRecords(parsedData);
    }
  }, []);


  const handleFinish = () => {
    if (confirm("Apakah anda yakin sudah selesai?")) {
      checkMiddleware();
    }
  }

  const handleGiveUp = () => {
    if (confirm("Apakah anda yakin sudah menyerah?")) {
      checkMiddleware();
    }
  }

  const checkMiddleware = async () => {
    let bucket = localStorage.getItem('LP3ISBPMB:bucket');
    bucket = JSON.parse(bucket);
    await axios.post(`https://api.politekniklp3i-tasikmalaya.ac.id/scholarship/records`, bucket)
      .then((response) => {
        alert(response.data.message);
        WinSoundPlay();
        localStorage.removeItem('LP3ISBPMB:bucket');
        localStorage.removeItem('timeLeft');
        localStorage.removeItem('id');
        navigate('/dashboard');
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    if (!state) {
      navigate("/dashboard");
    }
  }, [state, navigate]);

  const initialTime = parseInt(localStorage.getItem("timeLeft")) || 18000;
  const [timeLeft, setTimeLeft] = useState(initialTime);
  let interval;

  useEffect(() => {
    const stateId = localStorage.getItem("id");
    if (stateId) {
      localStorage.setItem("timeLeft", timeLeft.toString());
    }
  }, [timeLeft]);

  useEffect(() => {
    interval = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (timeLeft === 0) {
      clearInterval(interval);
      alert("Selesai");
      checkMiddleware();
    }
  }, [timeLeft]);

  useEffect(() => {
    getInfo();
  }, []);

  return (
    <main className="max-w-7xl mx-auto flex items-center justify-center md:h-screen md:py-5">
      <div className="w-full flex flex-col md:flex-row items-center">
        <form
          onSubmit={handleSave}
          className="order-1 md:order-none w-full md:w-9/12 rounded-none md:rounded-3xl bg-gray-50 border border-gray-200 p-10"
        >
          {
            loading ? (
              <section className="flex justify-center items-center">
                <p className="text-gray-800 text-sm">Sedang memuat data...</p>
              </section>
            ) : (
              <section>
                <header className="flex items-center justify-between">
                  <h2 className="font-bold text-lg text-lp3i-100 space-x-2">
                    <FontAwesomeIcon icon={faTag} />
                    <span>{active.category ?? ""}</span>
                  </h2>
                  <div className="flex gap-3">
                    {!isUpdate ? (
                      questions.length > 0 ? (
                        buttonActive &&
                        <button
                          type="submit"
                          className="bg-sky-500 hover:bg-sky-600 px-4 py-2 rounded-xl text-white flex items-center gap-2"
                        >
                          <span className="text-sm">Lanjutkan</span>
                          <FontAwesomeIcon icon={faChevronRight} />
                        </button>
                      ) : (
                        <button
                          onClick={handleFinish}
                          type="button"
                          className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-xl text-white flex items-center gap-2"
                        >
                          <span className="text-sm">Selesai</span>
                          <FontAwesomeIcon icon={faSave} />
                        </button>
                      )
                    ) : (
                      buttonActive &&
                      <button
                        type="submit"
                        className="bg-emerald-500 hover:bg-emerald-600 px-4 py-2 rounded-xl text-white flex items-center gap-2"
                      >
                        <span className="text-sm">Ubah Jawaban</span>
                        <FontAwesomeIcon icon={faSave} />
                      </button>
                    )}
                  </div>
                </header>
                <hr className="my-4 border-gray-300" />
                <p className="text-base font-medium leading-7" dangerouslySetInnerHTML={{ __html: active.question }}></p>
                <div className="mt-5 space-y-4">
                  {selected && (
                    <p className="text-sm space-x-2">
                      <FontAwesomeIcon icon={faCircleCheck} className="text-emerald-500" />
                      <span>Anda memilih &quot;{selected}&quot;</span>
                    </p>
                  )}
                  {answers.length > 0 &&
                    answers.map((answer) => (
                      <div key={answer.id} className="flex items-center">
                        <input
                          id={`answer-${answer.id}`}
                          type="radio"
                          name="answer"
                          data-category={answer.question.category_id}
                          data-question={answer.question_id}
                          data-text={answer.answer}
                          value={answer.id}
                          onChange={handleChange}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                        />
                        <label
                          htmlFor={`answer-${answer.id}`}
                          className="ml-2 text-sm text-gray-900"
                        >
                          {answer.answer}
                        </label>
                      </div>
                    ))}
                </div>
              </section>
            )
          }
        </form>
        <div className="order-2 md:order-none w-full md:w-3/12 space-y-4 p-10">
          <header className="text-center space-y-1">
            <span className="inline-block border border-gray-300 py-2 px-4 rounded-xl text-sm">{timeLeft}</span>
            <div className="space-y-1">
              <h1 className="font-bold text-gray-900">Berhenti Ujian.</h1>
              <p className="text-xs text-gray-800">
                Pertimbangan sebelum memutuskan menyerah.
              </p>
            </div>
          </header>
          <div className="w-full flex">
            <button type="button" onClick={handleGiveUp} className="w-full block bg-red-500 hover:bg-red-600 text-white py-2 text-sm rounded-xl">
              <FontAwesomeIcon icon={faHand} />
              <span className="ms-2">Menyerah</span>
            </button>
          </div>
          <hr />
          <div>
            <header className="text-center space-y-1 mb-3">
              <h1 className="font-bold text-gray-900">Soal Belum Terjawab</h1>
              <p className="text-xs text-gray-800">
                Silahkan untuk klik soal dibawah ini untuk menjawab.
              </p>
            </header>
            {questions.length > 0 ? (
              <div className="grid grid-cols-6 md:grid-cols-5 gap-3">
                {questions.map((question) => (
                  <button
                    key={question.id}
                    onClick={() => changeQuestion(question)}
                    className="flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-base px-5 py-2.5 rounded-xl"
                  >
                    <FontAwesomeIcon icon={faXmark} />
                  </button>
                ))}
              </div>
            ) : (
              <p className="bg-emerald-500 hover:bg-emerald-600 text-xs py-2 px-4 rounded-xl text-white text-center">Soal sudah terjawab.</p>
            )}
          </div>
          <hr />
          <div>
            <header className="text-center space-y-1 mb-3">
              <h1 className="font-bold text-gray-900">Soal Terjawab</h1>
              <p className="text-xs text-gray-800">
                Silahkan untuk klik soal dibawah ini untuk mengubah jawaban.
              </p>
            </header>
            {records.length > 0 ? (
              <div className="grid grid-cols-6 md:grid-cols-5 gap-2">
                {records.map((record, index) => (
                  <button
                    key={index}
                    onClick={() => updateQuestion(record)}
                    className="flex items-center justify-center bg-emerald-500 hover:bg-emerald-600 text-white text-base px-5 py-2.5 rounded-xl"
                  >
                    <FontAwesomeIcon icon={faCircleCheck} />
                  </button>
                ))}
              </div>
            ) : (
              <p className="bg-red-500 hover:bg-red-600 text-xs py-2 px-4 rounded-xl text-white text-center">Belum ada yang terjawab.</p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default TestSchoolarship;
