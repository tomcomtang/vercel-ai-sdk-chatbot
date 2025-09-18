export default function onRequestPost(context) {
  return new Response('Hello from Node Functions!', { status: 200 });
}