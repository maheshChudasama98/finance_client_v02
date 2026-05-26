import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';

import { useAmountVisibility } from 'src/hooks/use-amount-visibility';

import { getThemeColor } from 'src/utils/utils';
import { formatToINR } from 'src/utils/format-number';

import { AccountsFetchListService } from 'src/Services/Meter.Services';

import Iconify from 'src/components/iconify';

import { Swiper, SwiperSlide } from 'swiper/react';

export default function AccountList({ setCurrentBalance }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  const { isAmountVisible } = useAmountVisibility();

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = () => {
    setLoading(true);
    dispatch(
      AccountsFetchListService({}, (res) => {
        if (res?.status) {
          const filterData = res?.data?.list?.filter((i) => i.TypeId === 1 || i.TypeId === 2);

          const total = filterData.reduce(
            (sum, account) => sum + Number(account.CurrentAmount || 0),
            0
          );
          setCurrentBalance(total);

          setAccounts(filterData || []);
        } else {
          console.error('Failed to fetch accounts:', res?.message);
        }
        setLoading(false);
      })
    );
  };

  // const getAccountTypeName = (typeId) =>
  //   AccountTypes?.find((e) => e?.key === typeId)?.value || 'Account';

  if (loading) {
    return (
      <Card>
        <CardContent>
          <Grid container spacing={2}>
            {[1, 2, 3, 4].map((item) => (
              <Grid item xs={3} sm={6} md={3} key={item}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Skeleton variant="circular" width={40} height={40} />
                  <Box sx={{ flex: 1 }}>
                    <Skeleton variant="text" width="60%" />
                    <Skeleton variant="text" width="40%" />
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ p: { xs: 1, md: 2 } }}>
      {accounts.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 3 }}>
          <Iconify icon="eva:credit-card-outline" sx={{ fontSize: 48, color: 'text.disabled' }} />
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
            No Accounts found
          </Typography>
        </Box>
      ) : (
        <Box>
          <Swiper
            spaceBetween={15}
            slidesPerView="auto"
            loop={false}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            // breakpoints={{
            //   320: {
            //     slidesPerView: 2.2,
            //     // spaceBetween: 10,
            //   },
            //   480: {
            //     slidesPerView: 3.2,
            //     // spaceBetween: 10,
            //   },
            //   768: {
            //     slidesPerView: 3.2,
            //     // spaceBetween: 14,
            //   },
            //   1024: {
            //     slidesPerView: 4.2,
            //     // spaceBetween: 16,
            //   },
            // }}
          >
            {accounts.map((account) => (
              <SwiperSlide
                key={account.AccountId}
                style={{
                  width: 'auto', // 👈 important — lets min/max width apply
                }}
              >
                <Card
                  onClick={() => {
                    navigate('/accounts', { state: { accountId: account.AccountId } });
                  }}
                  sx={{
                    backgroundColor: getThemeColor(account?.Color, 0.2),
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    px: { xs: 1, md: 2 },
                    py: { xs: 0.5, md: 1 },
                    width: '100%',
                    minWidth: { xs: 150, md: 250 },
                    maxWidth: { xs: 180, md: 250 },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={2}
                      justifyContent="space-between"
                      width="100%"
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          fontSize: { xs: 16, md: 20 },
                        }}
                      >
                        <i className={account?.Icon} style={{ color: '#ffffff' }} />
                      </Typography>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 600,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            color: '#ffffff',
                            p: 0,
                            m: 0,
                            fontSize: { xs: 10, md: 14 },
                          }}
                        >
                          {account.AccountName}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: '#FFF',
                            p: 0,
                            m: 0,
                            fontSize: { xs: 10, md: 12 },
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {formatToINR(account.CurrentAmount || 0, isAmountVisible)}
                        </Typography>
                      </Box>

                      {/* <Typography
                        variant="body2"
                        sx={{
                          fontSize: 16,
                          color: '#ffffff',
                          fontWeight: 700,
                          fontSize: { xs: 12, md: 20 },
                        }}
                      >
                        {formatToINR(account.CurrentAmount || 0, isAmountVisible)}
                      </Typography> */}
                    </Stack>
                  </Box>
                </Card>
              </SwiperSlide>
            ))}
          </Swiper>
        </Box>
      )}
    </Card>
  );
}
