function sharePage(){
  let url = window.location.href;
  //console.log(url);
  let fullLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
  window.open(fullLink, '', 'scrollbar=yes, height=400, width=600');
  return false;
};

function sharePageOne(){
  let url = window.location.href;
  //console.log(url);
  let fullLink = `https://www.whatsapp.com`;
  window.open(fullLink, '', 'scrollbar=yes, height=400, width=600');
  return false;
};

function sharePageTwo(){
  let url = window.location.href;
  //console.log(url);
  let fullLink = `https://www.instagram.com`;
  window.open(fullLink, '', 'scrollbar=yes, height=400, width=600');
  return false;
};


const copyBtn = document.getElementById('copyLink');

copyBtn.addEventListener('click', () => {
  const url = window.location.href;
  navigator.clipboard.writeText(url).then(() => {
    alert('URL copied successfully!');
  }).catch(() => {
    alert('Error copying URL to clipboard');
  });
});
