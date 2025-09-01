import { useDispatch } from 'react-redux';
import React, { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';

import { lightenColor } from 'src/utils/utils';
import { formatToINR } from 'src/utils/format-number';

import { AccountTypes } from 'src/constance';
import { AccountsFetchListService } from 'src/Services/Meter.Services';

import Iconify from 'src/components/iconify';

import { Swiper, SwiperSlide } from 'swiper/react';

export default function AccountList({ setCurrentBalance }) {
  const dispatch = useDispatch();
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const getAccountTypeName = (typeId) =>
    AccountTypes?.find((e) => e?.key === typeId)?.value || 'Account';

  if (loading) {
    return (
      <Card>
        <CardContent>
          <Grid container spacing={2}>
            {[1, 2, 3, 4].map((item) => (
              <Grid item xs={12} sm={6} md={3} key={item}>
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
    <Card sx={{ p: 2.5 }}>
      {accounts.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 3 }}>
          <Iconify icon="eva:credit-card-outline" sx={{ fontSize: 48, color: 'text.disabled' }} />
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
            No accounts found
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
            // pagination={{
            //   clickable: true,
            //   dynamicBullets: true,
            // }}
            // navigation={true}
            breakpoints={{
              320: {
                slidesPerView: 1.2,
                spaceBetween: 10,
              },
              480: {
                slidesPerView: 1.2,
                spaceBetween: 10,
              },
              768: {
                slidesPerView: 3.2,
                spaceBetween: 14,
              },
              1024: {
                slidesPerView: 4.2,
                spaceBetween: 16,
              },
            }}
          >
            {accounts.map((account) => (
              <SwiperSlide key={account.AccountId}>
                <Card
                  sx={{
                    backgroundColor: lightenColor(account?.Color, 0.2),
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    // '&:hover': {
                    //   transform: 'translateY(-2px)',
                    //   boxShadow: (theme) => theme.customShadows.z24,
                    // },
                    px: 2,
                    py: 1,
                    borderRadius: 0.8,
                    width: '100%',
                    minWidth: 250,
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
                      <i className={account?.Icon} style={{ color: '#ffffff', fontSize: 25 }} />
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                          variant="subtitle2"
                          sx={{
                            fontWeight: 600,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            color: '#ffffff',
                            p: 0,
                            m: 0,
                          }}
                        >
                          {account.AccountName}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#FFF', p: 0, m: 0 }}>
                          {getAccountTypeName(account.TypeId)}
                        </Typography>
                      </Box>

                      <Typography
                        variant="subtitle2"
                        sx={{
                          fontSize: 16,
                          color: '#ffffff',
                          fontWeight: 700,
                        }}
                      >
                        {formatToINR(account.CurrentAmount || 0)}
                      </Typography>
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
