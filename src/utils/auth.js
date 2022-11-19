import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function setUserId(userId) {
  return Cookies.set("userId", userId)
}

export function getUserId() {
  return Cookies.get("userId")
}

export function setRoles(roles) {
  return Cookies.set("roles", roles)
}

export function getRoles() {
  return Cookies.get("roles")
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
