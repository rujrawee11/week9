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
  const [numbers, setNum] = useState([])
  const [image, setImage] = useState(null)
  const [Image2, setImage2] = useState(null)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const chooseFiles = (event) => {
    let input = document.getElementById('input')
    var fReader = new FileReader()
    fReader.readAsDataURL(input.files[0])
    fReader.onloadend = (e) => {
      console.log(e.target.result)
      setImage(e.target.result)
    }
  }
  const submitData = async () => {
    let sendNumber = numbers.split(" ")
    try {
      setLoading(true)
      const result = await axios.post(`http://${hostname}:8088/process-image`, { image: image, name: name, surname: surname, numbers: sendNumber }, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      setData(result.data)
      setImage2(result.data.processed_image)
      setLoading(false)
    }
    catch (e) {
      console.log(e)
    }
  }
  return (
    <div className={styles.container}>
      <h1 style={{ padding: "2%", margin: "2%" }}>LAB Week 9</h1>
      <div style={{ display: "column", justifyContent: "center", alignItems: "center" }}>
        <div style={{
          display: "column"
        }}>

          <div>Choose File :</div>
          <input id='input' type='file' onChange={() => chooseFiles()} />
        </div>
        <div style={{
          display: "column"
        }}>

          <div>Name :</div>
          <input type={"text"} onChange={(e) => setName(e.target.value)} placeholder={"Enter Name"} />

        </div>
        <div style={{
          display: "column"
        }}>

          <div>Surname :</div>
          <input type={"text"} onChange={(e) => setSurname(e.target.value)} placeholder={"Enter Surname"} />
        </div>
        <div style={{
          display: "column"
        }}>

          <div>Student ID: :</div>
          <input type={"text"} onChange={(e) => setNum(e.target.value)} placeholder={"Enter Student ID"} />
        </div>
        <button style={{

          padding: 2, backgroundColor: "cyan"
        }} onClick={() => submitData()}>Submit</button>
      </div>
      {image && (
        <div style={{ display: "flex" }}>
          <Image id='image' width={400} height={200} src={image} alt='pic1' style={{ objectFit: 'contain' }} />
        </div>
      )}
      <div style={{ display: "flex" }}>
        {Image2 && (
          <Image id='image2' width={400} height={200} src={Image2} alt='pic2' style={{ objectFit: 'contain' }} />
        )}
      </div>
      {
        data && (
          <div>
            <div style={{ display: "flex" }}>
              Name Surname :{data.name + "  " + data.surname}
            </div>

            {
              data.numbers.map((item, index) => (
                <text key={index}>
                  {item}
                </text>
              ))
            }
          </div>
        )}

    </div>
  )
}

export const getServerSideProps = async context => ({ props: { host: context.req.headers.host || null } })
