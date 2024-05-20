import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "./Navbar.jsx";
import axios from "axios";

import CointSound from '../../assets/sounds/coin.mp3';
import GameOverSound from '../../assets/sounds/gameover.mp3';
import WinSound from '../../assets/sounds/win.mp3';
import Loading from "../../components/Loading.jsx";

const TestSchoolarship = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const localStorageId = localStorage.getItem("id");

  const [loading, setLoading] = useState(false);

  const [buttonActive, setButtonActive] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!localStorageId) {
    if (state && state.id) {
      localStorage.setItem("id", state.id);
    }
  }

  const [identity, setIdentity] = useState("");
  const [active, setActive] = useState({});
  const [answers, setAnswers] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [records, setRecords] = useState([]);
  const [selected, setSelected] = useState(null);
  const [recordStudent, setRecordStudent] = useState(null);
  const [idUpdate, setIdUpdate] = useState(null);
  const [isUpdate, setIsUpdate] = useState(false);

  const token = localStorage.getItem("token");

  const coinPlay = () => {
    let audio = new Audio(CointSound);
    audio.play();
  }

  const gameOverPlay = () => {
    let audio = new Audio(GameOverSound);
    audio.play();
  }

  const winPlay = () => {
    let audio = new Audio(WinSound);
    audio.play();
  }


  const getUser = async () => {
    await axios
      .get("https://database.politekniklp3i-tasikmalaya.ac.id/api/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        let identityVal = response.data.user.identity;
        setIdentity(response.data.user.identity);
        getQuestions(identityVal);
      })
      .catch((error) => {
        if (error.response.status == 401) {
          localStorage.removeItem("token");
          navigate("/");
        } else {
          console.log(error);
        }
      });
  };

  const getQuestions = async (identity) => {
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
              (record) => record.question_id === question.id
            )
        );
        if (filterResponse.length > 0) {
          let id = filterResponse[0].id;
          const answerResponse = await axios.get(
            `https://api.politekniklp3i-tasikmalaya.ac.id/scholarship/answers/question/${id}`
          );
          setActive({
            category: filterResponse[0].category.name,
            question: filterResponse[0].question,
          });
          setAnswers(answerResponse.data);
          setQuestions(filterResponse);
          setRecords(recordResponse.data);
        } else {
          setAnswers([]);
          setQuestions([]);
          setActive({
            category: "Soal Sudah Selesai.",
            question: "Silahkan untuk klik selesai untuk menutup seleksi di kategori soal ini.",
          });
          setRecords(recordResponse.data);
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
    setSelected(null);
    setIdUpdate(null);
    setIsUpdate(false);
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
    setActive({
      category: record.question.category.name,
      question: record.question.question,
    });
    setIdUpdate(record.id);
    setIsUpdate(true);
    await axios
      .get(`https://api.politekniklp3i-tasikmalaya.ac.id/scholarship/answers/question/${record.question_id}`)
      .then((response) => {
        setAnswers(response.data);
        setSelected(record.answer.answer);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleChange = (e) => {
    setButtonActive(true);
    if (!isUpdate) {
      setSelected(null);
      setIdUpdate(null);
    }
    const question = e.target.getAttribute("data-question");
    const category = e.target.getAttribute("data-category");
    const answer = e.target.value;
    setRecordStudent({
      identity_user: identity,
      category_id: category,
      question_id: question,
      answer_id: answer,
    });
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    if (isSubmitting) {
      return;
    }
    setIsSubmitting(true);
    if (recordStudent) {
      if (isUpdate) {
        await axios
          .patch(`https://api.politekniklp3i-tasikmalaya.ac.id/scholarship/records/${idUpdate}`, recordStudent)
          .then((response) => {
            setSelected(null);
            setIsUpdate(false);
            setIdUpdate(null);
            getQuestions(identity);
            setRecordStudent(null);
            coinPlay();
            setLoading(false);
          })
          .catch((error) => {
            console.log(error);
            setLoading(false);
          });
      } else {
        if (questions.length > 0) {
          await axios
            .post(`https://api.politekniklp3i-tasikmalaya.ac.id/scholarship/records`, recordStudent)
            .then((response) => {
              getQuestions(identity);
              setRecordStudent(null);
              coinPlay();
              setLoading(false);
            })
            .catch((error) => {
              console.log(error);
              setLoading(false);
            });
        }
      }
      setButtonActive(false);
    } else {
      getQuestions(identity);
    }
    setIsSubmitting(false);
  };

  const checkMiddleware = () => {
    let confirmAlert = confirm('Yakin gasih mau nyerah?');
    if(confirmAlert){
      localStorage.removeItem("id");
      localStorage.removeItem("timeLeft");
      navigate("/scholarship");
    } else {
      alert('Yowis, mantap nih. Gas terooss! 💪')
    }
  };

  useEffect(() => {
    if (!state) {
      // navigate("/dashboard");
    }
  }, [state, navigate]);

  const initialTime = parseInt(localStorage.getItem("timeLeft")) || 1800;
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
    getUser();
  }, []);

  return (
    <div>
      <Navbar timeleft={timeLeft} />
      <section className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row">
          <form
            onSubmit={handleSubmit}
            className="order-1 md:order-none w-full md:w-9/12 md:rounded-xl bg-gray-100 p-6"
          >
            <header className="flex items-center justify-between">
              <h2 className="font-medium text-gray-900">
                {active.category ?? ""}
              </h2>
              <div className="flex gap-3">
                {!isUpdate ? (
                  questions.length > 0 ? (
                    buttonActive &&
                    <button
                      type="submit"
                      className="bg-sky-500 hover:bg-sky-600 px-4 py-2 rounded-xl text-white flex items-center gap-2"
                    >
                      { loading && <Loading width={5} height={5} fill="fill-sky-400" color="text-white" />}
                      <span className="text-sm">Lanjutkan</span>
                      <i className="fa-solid fa-chevron-right"></i>
                    </button>
                  ) : (
                    <button
                      onClick={() => { checkMiddleware(); winPlay(); }}
                      type="button"
                      className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-xl text-white flex items-center gap-2"
                    >
                      <span className="text-sm">Selesai</span>
                      <i className="fa-solid fa-save"></i>
                    </button>
                  )
                ) : (
                  buttonActive &&
                  <button
                    type="submit"
                    className="bg-emerald-500 hover:bg-emerald-600 px-4 py-2 rounded-xl text-white flex items-center gap-2"
                  >
                    <span className="text-sm">Ubah Jawaban</span>
                    <i className="fa-solid fa-save"></i>
                  </button>
                )}
              </div>
            </header>
            <hr className="my-4 border-gray-300" />
            <p className="text-base leading-7" dangerouslySetInnerHTML={{ __html: active.question }}></p>
            <div className="mt-5 space-y-4">
              {selected && (
                <p className="text-sm">
                  <i className="fa-solid fa-circle-check text-emerald-500"></i>{" "}
                  <span>Anda memilih {selected}</span>
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
                      value={answer.id}
                      onChange={handleChange}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                    />
                    <label
                      htmlFor={`answer-${answer.id}`}
                      className="ml-2 text-sm font-medium text-gray-900"
                    >
                      {answer.answer}
                    </label>
                  </div>
                ))}
            </div>
          </form>
          <div className="order-2 md:order-none w-full md:w-3/12 space-y-4 p-6">
            <header className="text-center space-y-1">
              <h1 className="font-bold text-gray-900">Berhenti Ujian.</h1>
              <p className="text-xs text-gray-800">
                Pertimbangan sebelum memutuskan menyerah.
              </p>
            </header>
            <div className="flex flex-col gap-2">
              <button onClick={() => { checkMiddleware(); gameOverPlay(); }} className="bg-red-500 hover:bg-red-600 text-white py-2 text-sm rounded-xl">
                <i className="fa-solid fa-hand mr-2"></i>
                <span>Menyerah</span>
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
                <div className="grid grid-cols-6 md:grid-cols-5 gap-2">
                  {questions.map((question) => (
                    <button
                      key={question.id}
                      onClick={() => changeQuestion(question)}
                      className="bg-gray-100 hover:bg-gray-200 text-base px-4 py-2 rounded-xl"
                    >
                      <i className="fa-solid fa-xmark"></i>
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
                  {records.map((record) => (
                    <button
                      key={record.id}
                      onClick={() => updateQuestion(record)}
                      className="bg-emerald-500 hover:bg-emerald-600 text-white text-base px-4 py-2 rounded-xl"
                    >
                      <i className="fa-solid fa-circle-check"></i>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="bg-red-500 hover:bg-red-600 text-xs py-2 px-4 rounded-xl text-white text-center">Belum ada yang terjawab.</p>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TestSchoolarship;
