import React, { useEffect } from 'react'
import { toast } from 'react-toastify'
import PageHead from 'src/components/PageHead'
import LoadingSpinner from 'src/svgs/LoadingSpinner'

const description = ''

const games = [
  {
    name: 'name',
    author: 'author',
    slug: 'slug',
  },
  {
    name: 'name2',
    author: 'author2',
    slug: 'slug2',
  },
  {
    name: 'name3',
    author: 'author3',
    slug: 'slug3',
  },
  {
    name: 'name4',
    author: 'author4',
    slug: 'slug4',
  },
]

function randomNotification() {
  const randomItem = Math.floor(Math.random() * games.length)
  const notifTitle = games[randomItem].name
  const notifBody = `Created by ${games[randomItem].author}.`
  const notifImg = `images/icon.png`
  const options = {
    body: notifBody,
    icon: notifImg,
  }
  new Notification(notifTitle, options)
  setTimeout(randomNotification, 5000)
}

export default function TestPage() {
  // async function displayNotification() {
  //   if (Notification.permission === 'granted') {
  //     const reg = await navigator.serviceWorker.getRegistration()

  //     reg?.showNotification('Hello world!')
  //   }
  // }

  // useEffect(() => {
  //   Notification.requestPermission(function (status) {
  //     console.log('Notification permission status:', status)
  //     displayNotification()
  //   })
  // }, [])

  return (
    <PageHead title="Test - 알파카살롱" description={description}>
      test
      <button
        onClick={async () => {
          const result = await Notification.requestPermission()

          if (result === 'granted') {
            randomNotification()
          }
        }}
      >
        click
      </button>
      <button
        onClick={() => {
          toast.success('asdf')
        }}
      >
        toast
      </button>
      <LoadingSpinner />
    </PageHead>
  )
}
