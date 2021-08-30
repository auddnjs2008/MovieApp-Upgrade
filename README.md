# 프로젝트 계획

redux의 이론을 공부한후 redux에 익숙해지기 위해 프로젝트 계획을 하게 되었습니다.
기존에 react class Component로 만들어봤던 mwflix 프로젝트를 함수형 component와  
redux로 다시 한번 만들어보기위해, 그리고 좀 더 세련되게 다시 만들어보고 싶어 시작하게
되었습니다. 추가로 여력이 되면 파이어베이스 사용을 연습해보기 위해서 입니다.

# 사용 기술 스택

<img src="https://img.shields.io/badge/HTML-E34F26?style=flat-square&logo=HTML5&logoColor=white"/> <img src="https://img.shields.io/badge/CSS-1572B6?style=flat-square&logo=CSS3&logoColor=white"/> <img src="https://img.shields.io/badge/Javascript-F7DF1E?style=flat-square&logo=JavaScript&logoColor=white"/>
<img src="https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=React&logoColor=white"/>
<img src="https://img.shields.io/badge/Redux-764ABC?style=flat-square&logo=Redux&logoColor=white"/>
<img src="https://img.shields.io/badge/Firebase-FFCA28?style=flat-square&logo=Firebase&logoColor=white"/>

# Page 구성

<section>
<h2>Auth page</h2>
<img src="https://user-images.githubusercontent.com/46766443/131417667-1cf9096e-92b8-4497-971b-d6d18338d66f.png"/>

<p>
    firebase를 활용해  로그인 화면 구성 -이메일 로그인, 구글 로그인 , 깃헙로그인, 필요하면 카톡 로그인 구성
</p>
</section>

<section>
<h2>Movie page</h2>
<img src="https://user-images.githubusercontent.com/46766443/131417980-6040d81a-7437-448f-bf9c-258f118228af.png"/>
<img src="https://user-images.githubusercontent.com/46766443/131418045-fdef44fd-77ac-4a15-abed-b0429e7ab728.png"/>
<p>
Popular movie,  Now Playing movie, Upcoming movie로 구성이 되어있고
각각을 무한 슬라이더로 구성을 하였다. 영화목록위에 마우스를 오버시 넷플릭스 처럼 
제목과 유튜브 비디오 클립 화면이 뜨도록 만들어 보았다.
</p>
</section>

<section>
<h2>Drama page</h2>
 Popular Drama, On_the air Drama, Top-Rated 드라마로 구성이 되어있다. 
 Movie Page와 기능은 같다
</section>

<sectino>
<h2>Search</h2>
<img src="https://user-images.githubusercontent.com/46766443/131418305-fdf9b06b-ae8e-43db-bb7a-be5892ed2be8.png"/>
 <p>
 Search 기능은  글자를 칠때마다 해당 되는 영화와 티비를 찾을수 있도록 기능을 만들어 보았다.
</p>
</section>

<section>
<h2>Detail page</h2>
<img src="https://user-images.githubusercontent.com/46766443/131418476-c5101b68-a6a2-4416-9777-5a108645adfa.png"/>
<img src="https://user-images.githubusercontent.com/46766443/131418556-3363401a-b3e9-4170-94f3-450b4489ccf8.png"/>
  <p>
   관련 유튜브 영상 ,   출연배우,  내용,  포스터사진등 영화의 자세한 부분을 확인 할 수 있다.
   책을 넘기는 듯한 css를 구현해 보았다. 
  </p> 
</section>

<sectino>
<h2>my page</h2>
<img src="https://user-images.githubusercontent.com/46766443/131418720-26ca6efa-5b02-473b-b3cc-ea48b6d11b13.png"/>
<img src="https://user-images.githubusercontent.com/46766443/131418807-d45597a8-e095-4b75-9534-a54b90ee78b4.png"/>
<p>
   내가 저장한 영화와 드라마의 목록을 볼 수 있다. 각 티켓을 마우스로 드래그할 경우 카카오톡 공유기능을
   활용할 수 있고 삭제 시킬 수 있다. 
</p>
</section>

## 사이트 주소

https://sharp-mestorf-c53780.netlify.app/#/
