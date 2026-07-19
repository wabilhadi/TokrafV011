fetch('https://tokraf.vercel.app/')
  .then(r=>r.text())
  .then(html=>{ 
    const js=html.match(/src="(\/assets\/index-[^"]+\.js)"/)[1]; 
    return fetch('https://tokraf.vercel.app'+js); 
  })
  .then(r=>r.text())
  .then(js=>console.log(js.includes('https://tokraf-backend.vercel.app') ? 'YES! API URL IS CORRECT' : 'NO! API URL IS MISSING'))
  .catch(e=>console.log(e));
