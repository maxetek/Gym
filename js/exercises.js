(function(){
  window.ExercisesModule={
    name:'exercises',
    setFilter(value,apply){
      if(typeof apply==='function')apply(value);
    },
    formatOptions(list,selectedId,escFn){
      const esc=typeof escFn==='function'?escFn:(s=>String(s??''));
      return (Array.isArray(list)?list:[]).map(e=>
        '<option value="'+esc(e.id)+'"'+(e.id===selectedId?' selected':'')+'>'+esc(e.name)+'</option>'
      ).join('');
    }
  };
})();
