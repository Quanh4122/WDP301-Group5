import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
import Typography from '@mui/material/Typography';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import PaymentForm from './components/PaymentForm';
import Review from './components/Review';
import AppTheme from '../shared-theme/AppTheme';
import { RequestModelFull, RequestUserBookingToBill } from '../checkout/models';
import InforPaymentCar from './components/InfoPaymentCar';
import PaymentDeposit from './components/PaymentDeposit';

interface Props {
  requestModal: RequestModelFull;
}

const steps = ['Shipping address', 'Payment details', 'Review your order'];
function getStepContent(step: number, requestData: RequestModelFull, handleNext: () => void, handleGetData: (value: RequestUserBookingToBill, requestNew: RequestModelFull) => void, requestSubmit: RequestUserBookingToBill | undefined) {
  switch (step) {
    case 0:
      return <InforPaymentCar requestData={requestData} handleNext={handleNext} handleGetData={handleGetData} />;
    case 1:
      return <PaymentDeposit dataPayment={requestSubmit} dataRequest={requestData} handleNext={handleNext} />;
    case 2:
      return <Review />;
    default:
      throw new Error('Unknown step');
  }
}
const Checkout2 = ({ requestModal }: Props) => {
  const [activeStep, setActiveStep] = React.useState(0);
  const [requestSubmit, setRequestSubmit] = React.useState<RequestUserBookingToBill>()
  const [requestDisplay, setRequestDisplay] = React.useState<RequestModelFull>(requestModal)

  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };
  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };
  const onGetData = (value: RequestUserBookingToBill, requestNew: RequestModelFull) => {
    setRequestSubmit(value)
    setRequestDisplay(requestNew)
    handleNext()
  }
  return (
    <Grid
      container
      sx={{
        mt: {
          xs: 4,
          sm: 0,
        },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Grid
        size={{ sm: 12, md: 7, lg: 8 }}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          backgroundColor: { xs: 'transparent', sm: 'background.default' },
          alignItems: 'center',
          pt: { xs: 0, sm: 16 },
          px: { xs: 2, sm: 5 },
          gap: { xs: 4, md: 8 },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: { sm: 'space-between', md: 'flex-end' },
            alignItems: 'center',
            width: '100%',
            maxWidth: { sm: '100%', md: 600 },
          }}
        >
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              flexDirection: 'column',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              flexGrow: 1,
            }}
          >
            <Stepper
              id="desktop-stepper"
              activeStep={activeStep}
              sx={{ width: '100%', height: 40 }}
            >
              {steps.map((label) => (
                <Step
                  sx={{ ':first-child': { pl: 0 }, ':last-child': { pr: 0 } }}
                  key={label}
                >
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1,
            width: '100%',
            maxWidth: { sm: '100%', md: 700 },
            gap: { xs: 5, md: 'none' },
          }}
        >
          <Stepper
            id="mobile-stepper"
            activeStep={activeStep}
            alternativeLabel
            sx={{ display: { sm: 'flex', md: 'none' } }}
          >
            {steps.map((label) => (
              <Step
                sx={{
                  ':first-child': { pl: 0 },
                  ':last-child': { pr: 0 },
                  '& .MuiStepConnector-root': { top: { xs: 6, sm: 12 } },
                }}
                key={label}
              >
                <StepLabel
                  sx={{ '.MuiStepLabel-labelContainer': { maxWidth: '70px' } }}
                >
                  {label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
          {activeStep === steps.length ? (
            <Stack spacing={2} useFlexGap>
              <Typography variant="h1">📦</Typography>
              <Typography variant="h5">Thank you for your order!</Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                Your order number is
                <strong>&nbsp;#140396</strong>. We have emailed your order
                confirmation and will update you once its shipped.
              </Typography>
              <Button
                variant="contained"
                sx={{ alignSelf: 'start', width: { xs: '100%', sm: 'auto' } }}
              >
                Go to my orders
              </Button>
            </Stack>
          ) : (
            <React.Fragment>
              {getStepContent(activeStep, requestDisplay, handleNext, onGetData, requestSubmit)}
              <Box
                sx={[
                  {
                    display: 'flex',
                    flexDirection: { xs: 'column-reverse', sm: 'row' },
                    alignItems: 'end',
                    flexGrow: 1,
                    gap: 1,
                    pb: { xs: 12, sm: 0 },
                    mt: { xs: 2, sm: 0 },
                    mb: '60px',
                  },
                  activeStep !== 0
                    ? { justifyContent: 'space-between' }
                    : { justifyContent: 'flex-end' },
                ]}
              >
                {/* {activeStep !== 0 && (
                  <Button
                    startIcon={<ChevronLeftRoundedIcon />}
                    onClick={handleBack}
                    variant="text"
                    sx={{ display: { xs: 'none', sm: 'flex' } }}
                  >
                    Previous
                  </Button>
                )}
                {activeStep !== 0 && (
                  <Button
                    startIcon={<ChevronLeftRoundedIcon />}
                    onClick={handleBack}
                    variant="outlined"
                    fullWidth
                    sx={{ display: { xs: 'flex', sm: 'none' } }}
                  >
                    Previous
                  </Button>
                )}
                {
                  activeStep != 1 || <Button
                    variant="contained"
                    endIcon={<ChevronRightRoundedIcon />}
                    onClick={handleNext}
                    sx={{ width: { xs: '100%', sm: 'fit-content' } }}
                  >
                    {activeStep === steps.length - 1 ? 'Place order' : 'Next'}
                  </Button>
                } */}

              </Box>
            </React.Fragment>
          )}
        </Box>
      </Grid>
    </Grid>
  );
}

export default Checkout2