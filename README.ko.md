# GitHub Follower Checker

[🇺🇸 English](README.md) | 🇰🇷 한국어

> 🔍 GitHub 팔로워 관계를 한눈에 파악해보세요

누가 나를 팔로우하고, 내가 누구를 팔로우하는지 궁금하셨나요? 상호 팔로우인지, 일방적인 관계인지 한 번에 확인할 수 있어요!

## 🖼️ 스크린샷

![GitHub Follower Checker 메인 화면](./screenshots/main.png)

## ✨ 이런 걸 할 수 있어요

- 👤 **GitHub 사용자명만 입력하면 끝** - 분석하고 싶은 사용자를 검색해보세요
- 📊 **관계를 깔끔하게 정리해드려요** - 세 가지 유형으로 나눠서 보여드려요
  - **상호 팔로우**: 서로 팔로우하는 관계예요 🤝
  - **나만 팔로우**: 내가 팔로우하지만 상대는 안 하는 일방적인 관심이에요 ➡️
  - **상대만 팔로우**: 상대가 나를 팔로우하지만 내가 안 하는 관계예요 ⬅️
- 🔐 **토큰 없이도 사용 가능해요!** - 하지만 토큰을 사용하시면 더 많은 분석이 가능해요
- 🌐 **한국어와 영어 모두 지원** - 편한 언어로 사용하세요
- 💾 **분석 결과를 저장하고 내보내기** - JSON 파일로 다운로드할 수 있어요
- ⚡ **API 사용량을 실시간으로 체크** - 얼마나 남았는지 한눈에 확인

## 🚀 개발자라면 이렇게 시작해보세요

### 요구사항

- Node.js 18.0 이상만 있으면 돼요
- pnpm 또는 npm
- GitHub 토큰은 선택사항이에요

### 실행하기

```bash
# 필요한 패키지들 설치하기
pnpm install

# 개발 서버 켜보기
pnpm dev

# 배포용으로 빌드하기
pnpm build

# 빌드 결과물 확인해보기
pnpm preview
```

### GitHub 토큰 만들기 (더 많은 분석을 원한다면)

1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. "Generate new token" 버튼을 눌러주세요
3. 이 권한들을 체크해주세요:
   - `read:user` - 사용자 정보를 읽기 위해서예요
   - `user:follow` - 팔로워/팔로잉 정보를 보기 위해서예요
4. 만들어진 토큰을 앱에서 입력하면 끝!

## 🛠️ 기술 스택

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Linting**: ESLint 9

## 📱 이렇게 사용해보세요

1. **토큰 입력 (선택사항)**: GitHub 토큰이 있다면 입력해주세요 (더 많은 분석이 가능해요!)
2. **사용자 검색**: 분석하고 싶은 GitHub 사용자명을 입력해보세요
3. **분석 시작**: "분석 시작" 버튼만 누르면 자동으로 시작돼요
4. **결과 구경하기**: 세 가지 관계 유형으로 깔끔하게 정리해서 보여드려요
5. **데이터 가져가기**: 마음에 들면 JSON 파일로 다운로드할 수도 있어요

## 🔒 개인정보는 안전해요

- 모든 데이터는 여러분 브라우저에만 저장돼요 (서버에 전송되지 않아요)
- 개인정보가 외부로 나가지 않으니까 안심하세요
- GitHub 토큰도 안전하게 보관되고, 절대 외부로 유출되지 않아요
- 언제든지 토큰을 삭제하고 데이터를 지울 수 있어요

## 📄 라이선스

MIT 라이선스로 자유롭게 사용하세요!

## 🤝 함께 만들어가요

개선 아이디어나 버그를 찾으셨다면 언제든지 알려주세요! 이슈나 풀 리퀘스트 모두 환영합니다.

## 📞 궁금한 게 있다면

- 버그나 개선사항: [GitHub Issues](https://github.com/shine-jung/github-follower/issues)
- 전체 소스코드: [GitHub Repository](https://github.com/shine-jung/github-follower)

---

**GitHub 커뮤니티를 위해 ❤️로 만들었어요**
