import axios from 'axios'
import Head from 'next/head'
import Image from 'next/image'
import react, { useState } from 'react'
import { headers } from '../next.config'
import styles from '../styles/Home.module.css'

export default function Home({ host }) {
  const hostname = host.substring(0, host.indexOf(":"))
  const [name, setName] = useState('')
  const [surname, setSurname] = useState('')
  const [numbers, setNumbers] = useState([])
  const [image, setImage] = useState(null)
  const [resImage, setResImage] = useState(null)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const handleChange = (event) => {
    let input = document.getElementById('input')
    var fReader = new FileReader()
    fReader.readAsDataURL(input.files[0])
    fReader.onloadend = (e) => {
      console.log(e.target.result)
      setImage(e.target.result)
    }
  }
  const sendImage = async () => {
    let sendNumber = numbers.split(" ")
    try {
      setLoading(true)
      const result = await axios.post(`http://${hostname}:8088/process-image`, { image: image, name: name, surname: surname, numbers: sendNumber }, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      setData(result.data)
      setResImage(result.data.processed_image)
      setLoading(false)
    }
    catch (e) {
      console.log(e)
    }
  }
  return (
    <div className={styles.container}>
      <h1 style={{ textAlign: "center", color: "red" }}>Dev tool week9</h1>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <input id='input' type='file' onChange={() => handleChange()} />
        <input type={"text"} onChange={(e) => setName(e.target.value)} placeholder={"input name"} />
        <input type={"text"} onChange={(e) => setSurname(e.target.value)} placeholder={"input surname"} />
        <input type={"text"} onChange={(e) => setNumbers(e.target.value)} placeholder={"input number (1 2)"} />
        <button onClick={() => sendImage()}>Send</button>
      </div>
      {image && (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Image id='image' width={600} height={400} src={image} alt='eiei' style={{ objectFit: 'contain' }} />
        </div>
      )}
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        {resImage && (
          <Image id='image2' width={600} height={400} src={resImage} alt='hello' style={{ objectFit: 'contain' }} />
        )}
      </div>
      {
        data && (
          <div>
            <div>
              {data.name + " " + data.surname}
            </div>
            <ul>
              {
                data.numbers.map((item, index) => (
                  <li key={index}>
                    {item}
                  </li>
                ))
              }
            </ul>
          </div>
        )}
      {
        loading && (
          <div style={{ position: "absolute", width: "100%", height: "100%", backgroundColor: "rgba(0,0,0, 0.5)", top: 0, left: 0 }}>
            <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", fontSize: "50px" }}>
              Loading
            </div>
          </div>
        )
      }
    </div>
  )
}

export const getServerSideProps = async context => ({ props: { host: context.req.headers.host || null } })