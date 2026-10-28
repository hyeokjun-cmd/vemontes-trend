/* Display evidence, never turn a missing flag into a verification claim. */
function evidenceLabel(row) {
  if (typeof row?.views !== 'number') return '미수집';
  const e=row.evidence?.views;
  if(e?.kind==='estimated')return '추정값';
  if(e?.source && e?.source_url && e?.observed_at) {
    const v=e.verification;
    if(v?.method==='native_display'&&v.checked_at&&v.url===row.url&&v.value===row.views)return '원본 대조 기록 있음';
    if(e.kind==='public_collected')return '공개 API 수집·원본 미대조';
  }
  return row.views_est?'미확인/추정':'미확인';
}
function sourceLine(row) {
  const e=row.evidence?.views;
  let line='조회수 출처: '+(e?.source||row.views_source||'개별 출처 미기록')+' · 수집: '+(e?.observed_at||'시각 미기록');
  if(e?.cached===true)line+=' · 캐시 응답';
  if(e?.view_scope==='provider_play_count_instagram_only_unconfirmed')line+=' · IG/FB 합산 가능';
  return line;
}
function analysisLabel(row) {
  return ({video_reviewed:'영상 확인 기록',frames_reviewed:'프레임 검토·시간/오디오 판단 제한',caption_only:'캡션 기반 해석',legacy_unrecorded:'직접 확인 근거 미기록'})[row.analysis_basis]||'직접 확인 근거 미기록';
}
function embedMarkup(row) {
  let src;
  try {
    const u=new URL(row.url);
    if(u.protocol!=='https:')return '';
    const host=u.hostname.replace(/^www\./,'');
    if(host==='instagram.com') {
      const id=u.pathname.match(/^\/(?:reel|p)\/([A-Za-z0-9_-]+)\/?$/)?.[1];
      if(id)src='https://www.instagram.com/reel/'+id+'/embed/';
    } else if(host==='tiktok.com') {
      const id=u.pathname.match(/\/video\/(\d+)\/?$/)?.[1];
      if(id)src='https://www.tiktok.com/player/v1/'+id;
    }
  }catch{return '';}
  return src?'<details class="video-embed"><summary>원본 영상 펼치기</summary><iframe data-embed-src="'+src+'" title="원본 영상" loading="lazy" width="100%" height="420" style="border:0" allow="fullscreen; encrypted-media" allowfullscreen></iframe><p class="fine">플랫폼에서 임베드를 제한하면 위 원본 링크로 확인하세요.</p></details>':'';
}
document.addEventListener('toggle',function(event){
  const box=event.target;
  if(!box.matches?.('.video-embed')||!box.open)return;
  const frame=box.querySelector('iframe[data-embed-src]');
  if(frame&&!frame.src)frame.src=frame.dataset.embedSrc;
},true);
