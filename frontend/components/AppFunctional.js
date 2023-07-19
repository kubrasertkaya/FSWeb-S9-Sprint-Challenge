import e from 'cors'
import React, { useState } from 'react'
import axios from 'axios'

// önerilen başlangıç stateleri
const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 5 //  "B" nin bulunduğu indexi
const theGrid = [
  "(1,1)",
  "(2,1)",
  "(3,1)",
  "(1,2)",
  "(1,3)",
  "(2,2)",
  "(3,2)",
  "(3,3)",
];

export default function AppFunctional(props) {
  // AŞAĞIDAKİ HELPERLAR SADECE ÖNERİDİR.
  // Bunları silip kendi mantığınızla sıfırdan geliştirebilirsiniz.
  const [coordState, setCoordState] = useState(initialIndex);
  const [steps, setSteps] = useState(0);
  const [message, setMessage] = useState('');
  const [theEmail, setTheEmail] = useState('');



  function getXY() {
    // Koordinatları izlemek için bir state e sahip olmak gerekli değildir.
    // Bunları hesaplayabilmek için "B" nin hangi indexte olduğunu bilmek yeterlidir.
    return theGrid[coordState];

  }



  function getXYMesaj(yon) {
    // Kullanıcı için "Koordinatlar (2, 2)" mesajını izlemek için bir state'in olması gerekli değildir.
    // Koordinatları almak için yukarıdaki "getXY" helperını ve ardından "getXYMesaj"ı kullanabilirsiniz.
    // tamamen oluşturulmuş stringi döndürür.
    if (yon == "left") {
      setMessage("Sola gidemezsiniz.");
    } else if (yon == "up") {
      setMessage("Yukarı gidemezsiniz.");
    } else if (yon == "right") {
      setMessage("Sağa gidemezsiniz.");
    } else if (yon == "up") {
      setMessage("Aşağı gidemezsiniz.");
    }
  }

  function reset() {
    // Tüm stateleri başlangıç ​​değerlerine sıfırlamak için bu helperı kullanın.
    console.log("reset zamanı");
    setSteps(initialSteps);
    setCoordState(initialIndex);
    setMessage(initialMessage);
    setTheEmail(initialEmail);

  }

  function sonrakiIndex(yon) {
    // Bu helper bir yön ("sol", "yukarı", vb.) alır ve "B" nin bir sonraki indeksinin ne olduğunu hesaplar.
    // Gridin kenarına ulaşıldığında başka gidecek yer olmadığı için,
    // şu anki indeksi değiştirmemeli.

  }

  function ilerle(yon) {
    // Bu event handler, "B" için yeni bir dizin elde etmek üzere yukarıdaki yardımcıyı kullanabilir,
    // ve buna göre state i değiştirir.
    if (yon == "left" && !(coordState % 3 == 0)) {
      setSteps(steps + 1);
      setCoordState(coordState - 1);
    } else if (yon == "up" && coordState / 3 >= 1) {
      setSteps(steps + 1);
      setCoordState(coordState - 3);
    } else if (yon == "right" && !(coordState % 3 == 2)) {
      setSteps(steps + 1);
      setCoordState(coordState + 1)
    } else if (yon == "down" && coordState / 3 < 2) {
      setSteps(steps + 1);
      setCoordState(coordState + 3)
    } else getXYMesaj(yon);
  }

  function onChange(evt) {
    // inputun değerini güncellemek için bunu kullanabilirsiniz
    setTheEmail(evt.target.value);
  }

  function onSubmit(evt) {
    // payloadu POST etmek için bir submit handlera da ihtiyacınız var.
    evt.preventDefault();
    const theData = {
      "x": theGrid[1],
     " y": theGrid[4],
     " steps": steps,
      "email": theEmail
    };
    setTheEmail(initialEmail);

    const config = {
      method: "post",
      url: "http://localhost:9000/api/result",
      headers: {
       " Content-Type": "application/json"
      },
      data: theData,
    };
    axios(config)
      .then((res)=> {
        setMessage(res.data.message);
        console.log(response.data.message);
      })
      .catch((err)=> {
        setMessage(err.res.data.message);
        console.log(error.response.data.message);

      })
      .finally(()=> {
        setTheEmail(initialEmail);
      });

  }

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">Koordinatlar{getXY()}</h3>
        <h3 id="steps">{steps} kere ilerlediniz</h3>
      </div>
      <div id="grid">
        {
          [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
            <div key={idx} className={`square${idx === coordState ? ' active' : ''}`}>
              {idx === coordState ? 'B' : null}
            </div>
          ))
        }
      </div>
      <div className="info">
        <h3 id="message">{message}</h3>
      </div>
      <div id="keypad">
        <button onClick={(e) => ilerle(e.target.id)} id="left">SOL</button>
        <button onClick={(e) => ilerle(e.target.id)} id="up">YUKARI</button>
        <button onClick={(e) => ilerle(e.target.id)} id="right">SAĞ</button>
        <button onClick={(e) => ilerle(e.target.id)} id="down">AŞAĞI</button>
        <button onClick={(e) => reset()} id="reset">reset</button>
      </div>
      <form onSubmit={onSubmit}>
        <input onChange={(e) => setTheEmail(e.target.value)}id="email" type="email" placeholder="email girin"
          value={theEmail}
        ></input>
        <input id="submit" type="submit"></input>
      </form>
    </div>
  )
}
