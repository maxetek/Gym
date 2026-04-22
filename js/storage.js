(function(){
  const prefix='gyt_';
  function save(k,v){
    try{localStorage.setItem(prefix+k,JSON.stringify(v));}catch(e){}
  }
  function load(k,d){
    try{const v=localStorage.getItem(prefix+k);return v?JSON.parse(v):d;}catch(e){return d;}
  }
  window.AppStorage={prefix,save,load};
})();
