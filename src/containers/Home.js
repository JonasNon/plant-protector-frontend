import { connect } from 'react-redux'
import Home from '../components/Home'

const mapStateToProps = (state) => {
    return {
        users: state.users
    }
}

export default connect(mapStateToProps)(Home)
