import { connect } from 'react-redux'
import SearchBar from '../components/SearchBar'
import { saveSearch } from '../redux/actions'


const mapStateToProps = (state) => {
    return {
        users: state.users,
        search: state.search
    }
}

const mapDispatchToProps = (dispatch) => ({
  saveSearch: (term) => dispatch(saveSearch(term)),  // Dispatch the search term update
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchBar);
