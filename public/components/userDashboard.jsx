import React from 'react';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import { useState, useEffect } from 'react';
import { LS } from '../../src/constants';
import { ThemeProvider } from '@mui/material/styles';
import { customTheme } from './Theme.jsx';
import { support_email, domain } from '../../src/constants.js';
import { deepPurple } from '@mui/material/colors';
import Paper from '@mui/material/Paper';
import CompareIcon from '@mui/icons-material/Compare';
import GppBadIcon from '@mui/icons-material/GppBad';
import GoPremiumFooter from './modules/goPremiumFooter.jsx';
const useStyles = makeStyles((theme) => ({
  main: {
    paddingTop: '6px',
    display: 'flex',
    flexDirection: 'column',
    width: 'auto',
    height: 'auto',
    backgroundColor: 'white',
    paddingLeft: '0px !important',
    paddingRight: '0px !important',
  },
  logo: {
    '&:hover': {
      cursor: 'pointer',
    },
    height: '65px',
  },
  counterText: {
    padding: '6px',
    textAlign: '-webkit-center',
    fontSize: 'inherit !important',
    fontWeight: 'bold !important',
  },
  counterDigits: {
    fontSize: '20px !important',
    fontWeight: 'bold !important',
  },
  flexColumnContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  borderRight: {
    borderRight: '1px solid black',
  },
  halfWidth: {
    width: '50%',
  },
  flexRowContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  alignCenter: {
    alignItems: 'center',
  },
  paper: {
    height: '75px',
  },
  head: {
    paddingLeft: '20px',
    paddingRight: '20px',
    paddingBottom: '10px',
    borderBottom: '1px solid rgb(223, 226, 229)',
    borderRadius: '6px 6px 0px 0px',
  },
  spaceBetween: {
    placeContent: 'space-between',
  },
  centerAlign: {
    placeContent: 'center',
  },
  alignLeft: {
    alignItems: 'baseline',
  },
  userInfoBox: {
    width: '315px',
    background: deepPurple['A100'],
  },
  userInfoPadded: {
    margin: '16px',
    borderRadius: '6px',
    backgroundColor: 'white',
    border: '1px solid black',
  },
  functionalityBox: {
    placeContent: 'space-between',
    alignItems: 'center',
    margin: '5px',
  },
  innerPaddedTypography: {
    margin: '5px',
  },
}));

export default function UserDashboard({ setpage, functionalityEnabled }) {
  console.log('rendering');
  console.log(functionalityEnabled);
  let [greeting, setgreeting] = useState();
  let [isPremium, setisPremium] = useState();
  let [isFreeTrialActive, setisFreeTrialActive] = useState();
  let [COUNTER_total_video_scanned, setCOUNTER_total_video_scanned] =
    useState();
  let [COUNTER_censored_videos, setCOUNTER_censored_videos] = useState();
  let [isVideoScanEnabled, setisVideoScanEnabled] = useState(true);
  const classes = useStyles();
  let user_name;
  let user_profile;
  async function updateState() {
    console.log('inside updateState');
    user_profile = await LS.getItem('User_Profile');
    user_name = user_profile.name;
    setisVideoScanEnabled(await LS.getItem('isVideoScanEnabled'));
    setCOUNTER_total_video_scanned(
      await LS.getItem('COUNTER_total_video_scanned')
    );
    setCOUNTER_censored_videos(await LS.getItem('COUNTER_censored_videos'));
    setisPremium(user_profile.premium_membership);
    setisFreeTrialActive(user_profile.free_trial);
    var today = new Date();
    var curHr = today.getHours();
    let greeting;
    if (curHr < 12) {
      setgreeting('Good morning, ' + user_name);
    } else if (curHr < 18) {
      setgreeting('Good afternoon, ' + user_name);
    } else {
      setgreeting('Good evening, ' + user_name);
    }
  }
  let handleSwitchClick = async (e) => {
    console.log('change');
    let switchPosition = e.target.checked;
    console.log(switchPosition);
    await LS.setItem('isVideoScanEnabled', switchPosition);
    setisVideoScanEnabled(switchPosition);
    return;
  };
  useEffect(() => {
    updateState();
  }, []);
  let goPremiumFooter;
  let membership;
  if (isFreeTrialActive && !isPremium) {
    membership = 'Free Trial';
    goPremiumFooter = <GoPremiumFooter />;
  } else if (!isFreeTrialActive && !isPremium) {
    membership = 'Free Trial Expired';
    goPremiumFooter = <GoPremiumFooter />;
  } else {
    membership = 'Premium';
  }
  return (
    <ThemeProvider theme={customTheme}>
      <Container className={classes.main}>
        <Box
          id="logoContainer"
          className={[
            classes.flexRowContainer,
            classes.head,
            classes.alignCenter,
            classes.spaceBetween,
          ].join(' ')}
        >
          <img
            src="../icons/logo.png"
            className={classes.logo}
            onClick={() => window.open(domain)}
          />
          <Link href={'mailto:' + support_email}>Contact Us</Link>
        </Box>
        <Box
          id="userDashboard"
          className={[
            classes.flexColumnContainer,
            classes.userDashboard,
            classes.userInfoBox,
          ].join(' ')}
        >
          <Box className={classes.userInfoPadded}>
            <Box
              className={[classes.flexColumnContainer, classes.alignLeft].join(
                ' '
              )}
              id="UserInfo"
            >
              <Typography
                component="p"
                color="secondary"
                sx={{
                  fontSize: '14px',
                  fontFamily: 'corsive',
                  margin: '5px',
                  paddingTop: '5px',
                }}
              >
                {greeting}
              </Typography>
              <Typography
                component="p"
                color="secondary"
                sx={{
                  fontSize: '12px',
                  fontFamily: 'corsive',
                  margin: '5px',
                  marginTop: '-1px',
                }}
              >
                Your membership: {membership}
              </Typography>
            </Box>
            <Box
              className={[
                classes.flexRowContainer,
                classes.functionalityBox,
              ].join(' ')}
              id="functionalityContainer"
            >
              <Typography component="p" color="secondary">
                Enable Video Scan
              </Typography>
              <Switch
                color="primary"
                checked={isVideoScanEnabled}
                onClick={handleSwitchClick}
                disabled={functionalityEnabled}
              />
            </Box>
          </Box>
          <Box id="counters" className={classes.userInfoPadded}>
            <Paper
              elevation={3}
              className={[classes.paper, classes.flexRowContainer].join(' ')}
            >
              <Box
                className={[
                  classes.flexColumnContainer,
                  classes.borderRight,
                  classes.halfWidth,
                ].join(' ')}
              >
                <Typography
                  component="p"
                  color="secondary"
                  className={classes.counterText}
                >
                  Total Video Scanned
                </Typography>
                <Box
                  id="totalVideoScannedContainer"
                  className={[
                    classes.flexRowContainer,
                    classes.alignCenter,
                    classes.centerAlign,
                  ].join(' ')}
                >
                  <CompareIcon color="secondary" />
                  <Typography
                    component="h2"
                    align="center"
                    color="secondary"
                    className={classes.counterDigits}
                  >
                    {COUNTER_total_video_scanned}
                  </Typography>
                </Box>
              </Box>
              <Box
                className={[
                  classes.flexColumnContainer,
                  classes.halfWidth,
                ].join(' ')}
              >
                <Typography
                  component="p"
                  color="secondary"
                  className={classes.counterText}
                >
                  Censored Videos
                </Typography>
                <Box
                  id="censored_videosContainer"
                  className={[
                    classes.flexRowContainer,
                    classes.alignCenter,
                    classes.centerAlign,
                  ].join(' ')}
                >
                  <GppBadIcon color="secondary" />
                  <Typography
                    component="h2"
                    color="secondary"
                    align="center"
                    className={classes.counterDigits}
                  >
                    {COUNTER_censored_videos}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Box>
          {goPremiumFooter}
        </Box>
      </Container>
    </ThemeProvider>
  );
}
