import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

const sleep = (time: number) => {
  return new Promise((resolve) => setTimeout(resolve, time))
}

const DumbComponentOne = () => {
  const { data, isLoading, isRefetching, error } = useQuery({
    queryKey: ['test'],
    queryFn: async () => {
      await sleep(2000)
      const number = Math.random()
      console.log("DumbComponentOne", number)

      return Promise.resolve(number)
    }
  })
  if (isLoading) return <div>Loading...</div>
  if (isRefetching) return <div>isRefetching</div>
  if (error) return <div>Error: {error.message}</div>
  return <div>{data}</div>
}

const DumbComponentTwo = () => {
  const { data, isLoading, error, isFetching} = useQuery({
    queryKey: ['test'],
    queryFn: async () => {
  await sleep(2000)
      const number = Math.random()
      console.log("DumbComponentTwo", number)

      return Promise.resolve(number)
    }
  })
  if (isLoading) return <div>Loading...</div>
  if(isFetching) return <div>isFetching</div>
  if (error) return <div>Error: {error.message}</div>
  return <div>{data}</div>
}

const DumbComponentThree = ({ count }: { count: number }) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['test'],
    queryFn: async () => {
      await sleep(2000)
      const number = Math.random()
      console.log("DumbComponentThree", number)

      return Promise.resolve(number)
    }, enabled: true
  })
  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  return <div>{data}</div>
}


export const Route = createFileRoute('/index-for-tanstart-branch')({
  component: Home,
})

function Home() {
  const [count, setCount] = useState(0)
  return (
    <div className="p-2">
      <h3>Welcome Home!</h3>
      <button type="button" onClick={() => setCount(count + 1)}>increment</button>
      <span>counter: {count}</span>
      <DumbComponentOne />
      <DumbComponentTwo />
      {count === 3 && <DumbComponentThree count={count} />}
    </div>
  )
}