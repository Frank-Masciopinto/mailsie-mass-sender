import { makeStyles } from '@material-ui/core/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import AllInclusiveIcon from '@mui/icons-material/AllInclusive';
import Button from '@material-ui/core/Button';
import Typography from '@mui/material/Typography';
import React from 'react';

import { buyPremiumUrl } from '../../../src/constants.js';


const useStyles = makeStyles((theme) => ({
    upsellPremiumMembership: {
        borderTop: '1px solid #000000',
        height: 'fit-content',
        backgroundColor: 'white',
      },
      flexRowContainer: {
        display: 'flex',
        flexDirection: 'row',
      },
      goPremiumText: {
        placeSelf: 'center',
        lineHeight: '1.1 !important',
      },
      upgradePremiumButton: {
        padding: '0px',
        margin: '8px 5px',
        height: '31px',
        fontSize: '11px',
        width: '195px',
        backgroundColor: '#7c4dff',
      },
}))


export default function GoPremiumFooter() {
    const classes = useStyles();

    return (
        <Box
            id="upsellPremiumMembership"
            className={classes.upsellPremiumMembership}
          >
            <Paper
              elevation={3}
              className={[classes.flexRowContainer].join(' ')}
            >
              <AllInclusiveIcon
                fontSize="large"
                color="primary"
                sx={{
                  placeSelf: 'center',
                  marginLeft: '10px',
                }}
              />
              <Typography
                component="p"
                color="primary"
                align="center"
                className={classes.goPremiumText}
              >
                Get Unlimited Video Scans
              </Typography>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                className={classes.upgradePremiumButton}
                onClick={() => window.open(buyPremiumUrl)}
              >
                Upgrade To Premium
              </Button>
            </Paper>
          </Box>
    )
}