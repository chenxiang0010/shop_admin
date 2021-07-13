export default {
  auth_request (state) {
    state.status = 200
  },
  auth_success (state, token) {
    state.status = 200
    state.token = token
  },
  logout (state) {
    state.token = ''
  }
}
