import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Paper, Typography } from '@material-ui/core';
import { Button } from 'react-bootstrap'
import './searchBy.css'
import { Autocomplete } from '@material-ui/lab';
import TextField from '@material-ui/core/TextField';
import { fade } from '@material-ui/core/styles/colorManipulator';
import { Redirect } from 'react-router';

const styles = theme => ({
    root: {
        padding: theme.spacing(3, 2),
        background: fade('#57068c', 0.85),
        color: 'white',
        marginTop: '10%'
        
    },
    intro: {
        width: "50%",
        marginLeft: "25%"
    },
    prompt: {
        marginTop: "1%",
        width: "50%",
        marginLeft: "25%"
    }
});

class SearchBy extends React.Component {
    constructor(props) {
        super(props);

        this._isMounted = true;
        this.state = {
            displaySearch: false,
            schools: [],
            majors: []
        };
    }

    componentDidMount() {
        fetch(`/search/schools`, { method: "GET" })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Network response was not ok.');
                }
            }).then(response => {
                console.log("response: ", response.schools)
                if (this._isMounted) {
                    console.log("response: ", response.schools)
                    this.setState({ schools: response.schools })
                }
            });
    }

    componentWillUnmount() {
        this._isMounted = false
    }

    handleClick() {
        this.setState({
            displaySearch: true
        })
    }

    handleSearch() {
        this.setState({
            redirect: true
        });
    }

    handleSchoolChange(event, value) {
        console.log(value)
        fetch(`/search/schools/${value}`, { method: "GET" })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Network response was not at search by major');
                }
            }).then(response => {
                    if (this._isMounted) {
                        this.setState({
                            majors : response.majors,
                            sel_school: value
                        })
                    }
                })
    }

    handleMajorChange(event, value) {
        this.setState({
            sel_major : value
        })
    }

    render() {
        const { classes } = this.props;
        let display;
        if (this.state.redirect) {
            return <Redirect to={{
                pathname: '/course',
                state: {
                    sel_school :this.state.sel_school,
                    sel_major : this.state.sel_major
                }
            }}/>;
        }
        if (!this.state.displaySearch) {
            display =
            <div>
            <Typography component="p" className={classes.intro}>
                    The EasyNYU Team is dedicated to creating
                    a safe and friendly community for students
                    to comment freely on the courses taken and on
                    associated professors.
            </Typography>
            <Typography className={classes.prompt}>
                    Start by searching for your favorite courses and professors
                    and sharing your opinion! You will need to login before
                    adding a comment.
            </Typography> 
            <Button size="lg" variant="outline-light" 
            onClick={this.handleClick.bind(this)} 
            className="search-by">Search By Major</Button>
            </div>
        } else {
            display =
            <div className='major-search-div'>
                <Typography>Looking for Course/Professor in School:</Typography>
                <Autocomplete
                    className='major-search'
                    id="school-auto"
                    options={this.state.schools}
                    getOptionLabel={option => option}
                    style={{ width: 300 }}
                    renderInput={params => (
                        <TextField {...params} 
                        label="School Name" 
                        variant="filled" 
                        fullWidth/>
                    )}
                    onChange={this.handleSchoolChange.bind(this)}
                />
                <Typography style={{marginTop: "3%"}}>In Major:</Typography>
                <Autocomplete
                    className='major-search'
                    id="class-auto"
                    options={this.state.majors}
                    getOptionLabel={option => option}
                    style={{ width: 300 }}
                    renderInput={params => (
                        <TextField 
                        {...params} 
                        label="Major Name" 
                        variant="filled" 
                        fullWidth/>
                    )}
                    onChange={this.handleMajorChange.bind(this)}
                />
                <Button size="lg" variant="outline-light" 
                onClick={this.handleSearch.bind(this)} 
                className='major-search-btn'>Search</Button>
            </div>
        }
        return (
            <Paper square='true' className={classes.root}>
                {display}
            </Paper>
        )
    }
}

export default withStyles(styles)(SearchBy);