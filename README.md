<picture>![header](https://capsule-render.vercel.app/api?type=waving&color=b9e0f0&height=200&animation=fadeIn&section=header&text=V-ONE&fontSize=90)</picture>
<br>

<hr/>

<h3>Stacks</h3>

<h4>Virtual Software:
 <a href="#"><img src="https://img.shields.io/badge/Virtual Box-183A61?style=for-the-badge&logo=VirtualBox&logoColor=white"></a> 


<h4>Front-End :
 <a href="#"><img src="https://img.shields.io/badge/Pug-A86454?style=for-the-badge&logo=Pug&logoColor=white"></a> 
 <a href="#"><img src="https://img.shields.io/badge/sass-CC6699?style=for-the-badge&logo=sass&logoColor=white"/></a> 
</h4>
 
<h4>Back-End : 
<a href="#"><img src="https://img.shields.io/badge/node.js-339933?style=for-the-badge&logo=Node.js&logoColor=white"></a>
<a href="#"><img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=Express&logoColor=white"></a>
<a href="#"><img src="https://img.shields.io/badge/Mongo-47A248?style=for-the-badge&logo=mongodb&logoColor=white"></a>
 <a href="#"><img src="https://img.shields.io/badge/Mongoose-880000?style=for-the-badge&logo=mongoose&logoColor=white"></a>

   </h4>
   
<h4>Blockchain Network : 
<a href="#"><img src="https://img.shields.io/badge/Hyperledger Fabric-2F3134?style=for-the-badge&logo=Hyperledger&logoColor=white"></a>
<a href="#"><img src="https://img.shields.io/badge/Go-00ADD8?style=for-the-badge&logo=Go&logoColor=white"></a> 
 <a href="#"><img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=Docker&logoColor=white"></a
</h4>
   
<hr/>

<h3>Team Notion</h3>
자세한 설명과 발표 내용은 노션을 참고해주세요!
<br/>
<br/>
<a href="https://www.notion.so/Project-V-ONE-96d3d032ac3b42c19397781e711aef7f" target="_blank">
<img src="https://simpleicons.org/icons/notion.svg" width=100 height=100></a>


# 증명서 통합 관리 블록체인 서비스

증명서를 블록체인에 발급해 위변조를 방지하고, 개인이 여러 기관에서 발급한 증명서들을 통합 관리할 수 있고, 증명서를 확인하는 회사, 기관에 제출과 확인이 가능한 통합 서비스를 만들고자 했습니다.

<h3> Team members </h3>
<table>
 <tr>
  <td align='center'>이름</td>
  <td align='center'>역할</td>
  <td align='center'>GitHub</td>

 </tr>
 
 <tr>
  <td align='center'>김영주</td>
  <td align='center'>프론트엔드, 백엔드, 블록체인 네트워크 구축</td>
  <td align='center'><a href="https://github.com/DreamBoysYJ">DreamBoysYJ</a></td>

 </tr>   
 
 <tr>
  <td align='center'>민정근</td>
  <td align='center'>디자인, 기획, 아이디어</td>
  

 </tr>

  <tr>
  <td align='center'>서종현</td>
  <td align='center'>스마트 컨트랙트, 블록체인 네트워크 구축</td>
  <td align='center'><a href="https://github.com/keepgoing2021">keepgoing2021</a></td>

 </tr>
 

</table>

#  Structure
크게 Dapp과 블록체인 네트워크로 나눌 수 있습니다.
<br/>
<br/>
<img width="600" alt="스크린샷 2023-03-24 오후 1 36 29" src="https://github.com/codestates-beb/BEB-08-second-TokenInside/assets/89343745/b0674589-113e-4f80-8ebc-5a4dc32dd544">



#  Functions




## 회원가입, 로그인

개인 회원가입 시 CA가 지갑과 인증서를 발급하고 서버에 저장합니다.
<img width="600" alt="스크린샷 2023-03-24 오후 1 36 29" src="https://github.com/codestates-beb/BEB-08-second-TokenInside/assets/89343745/ab8589de-da38-4226-92e4-440e9e94b988">

## 증명서 등록
블록체인 네트워크에 Peer로 등록된 기관일 경우 증명서 등록이 가능합니다.
증명서는 블록체인에 JSON 형식으로, MongoDB에 이중으로 저장됩니다.
이 때, 증명서 주인의 userId는 지갑 ID와 일치해야 하므로 주의해야 합니다.
<img width="600" alt="스크린샷 2023-03-24 오후 1 36 29" src="https://github.com/codestates-beb/BEB-08-second-TokenInside/assets/89343745/57727e60-311c-4bc1-82a2-332d26437740">

블록체인에 JSON 형식으로 저장된 것을 확인할 수 있습니다.
<img width="600" alt="스크린샷 2023-03-24 오후 1 36 29" src="https://github.com/codestates-beb/BEB-08-second-TokenInside/assets/89343745/013770e7-06c6-43b3-894e-2fa087cc5bc8">


## 개인 증명서 확인
여러 증명서 등록 기관에서 발급한 증명서들을 한번에 조회가 가능합니다.
개인이 직접 증명서를 등록할 수도 있으나, 이는 블록체인이 아닌 Mongo DB에만 저장되며, 
증명서를 확인하는 경우 블록체인에 등록된 문서와 구분됩니다.
<img width="600" alt="스크린샷 2023-03-24 오후 1 36 29" src="https://github.com/codestates-beb/BEB-08-second-TokenInside/assets/89343745/57727e60-311c-4bc1-82a2-332d26437740">









