export const isValidEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/

    // 정규 표현식을 사용하여 이메일 유효성 확인
    return emailRegex.test(email)
}

export const isEmpty = (text) => {
    const emptyRegex = /^\s*$/;

    return emptyRegex.test(text)
}