import { useDispatch } from 'react-redux';
import React, { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import AlertTitle from '@mui/material/AlertTitle';
import CardContent from '@mui/material/CardContent';

import { formatToINR } from 'src/utils/format-number';

import { AccountTypes } from 'src/constance';
import { PartiesFetchListService, AccountsFetchListService } from 'src/Services/Meter.Services';

import Loader from 'src/components/Loaders/Loader';
import { CustomAvatar } from 'src/components/CustomComponents';
// import { DataNotFound } from 'src/components/DataNotFound';

export default function NegativeBalanceAlert() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [accounts, setAccounts] = useState([]);
  const [parties, setParties] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setLoading(true);

    // Fetch accounts
    dispatch(
      AccountsFetchListService({}, (res) => {
        if (res?.status) {
          const negativeAccounts =
            res?.data?.list?.filter((account) => (account?.CurrentAmount || 0) < 0) || [];
          setAccounts(negativeAccounts);
        }
      })
    );

    // Fetch parties
    dispatch(
      PartiesFetchListService({}, (res) => {
        if (res?.status) {
          const negativeParties =
            res?.data?.list?.filter((party) => (party?.CurrentAmount || 0) < 0) || [];
          setParties(negativeParties);
          setLoading(false);
        }
      })
    );
  };

  const getAccountTypeName = (typeId) =>
    AccountTypes?.find((e) => e?.key === typeId)?.value || 'Unknown';

  const getTotalNegativeAmount = () => {
    const accountTotal = accounts.reduce((sum, acc) => sum + (acc?.CurrentAmount || 0), 0);
    const partyTotal = parties.reduce((sum, party) => sum + (party?.CurrentAmount || 0), 0);
    return accountTotal + partyTotal;
  };

  const totalNegativeAmount = getTotalNegativeAmount();
  const hasNegativeBalances = accounts.length > 0 || parties.length > 0;

  if (loading) {
    return (
      <Card>
        <CardContent sx={{ p: 3, textAlign: 'center' }}>
          <Loader />
        </CardContent>
      </Card>
    );
  }

  if (!hasNegativeBalances) {
    return (
      <Card>
        <CardContent sx={{ p: 3, textAlign: 'center' }}>
          <Alert severity="success" sx={{ mb: 2 }}>
            <AlertTitle>Great!</AlertTitle>
            No negative balances found. All accounts and parties are in good standing.
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader
        title="Negative Balance Alert"
        subheader={`${accounts.length + parties.length} items with negative balances`}
        action={
          <Chip
            label={`Total: ${formatToINR(totalNegativeAmount)}`}
            color="error"
            variant="filled"
            sx={{ fontWeight: 600 }}
          />
        }
      />

      <CardContent>
        <Alert severity="error" sx={{ mb: 3 }}>
          <AlertTitle>Attention Required</AlertTitle>
          The following accounts and parties have negative current amounts that require immediate
          attention.
        </Alert>

        {/* Accounts Section */}
        {accounts.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, color: 'error.main', fontWeight: 600 }}>
              Accounts with Negative Balance ({accounts.length})
            </Typography>
            <Grid container spacing={2}>
              {accounts.map((account) => (
                <Grid item xs={12} sm={6} md={4} key={account?.AccountId}>
                  <Card
                    sx={{
                      border: 2,
                      borderColor: 'error.main',
                      backgroundColor: 'error.light',
                      backgroundOpacity: 0.1,
                      '&:hover': {
                        boxShadow: 4,
                        transform: 'translateY(-2px)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <CardContent sx={{ p: 2 }}>
                      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 1 }}>
                        <CustomAvatar
                          iconSize={12}
                          icon={account?.Icon}
                          bgColor={account?.Color}
                          width={35}
                          height={35}
                        />
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 0.5 }}>
                            {account?.AccountName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {getAccountTypeName(account?.TypeId)}
                          </Typography>
                        </Box>
                        <Chip label="Negative" size="small" color="error" variant="filled" />
                      </Stack>

                      <Box sx={{ mt: 1 }}>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ display: 'block' }}
                        >
                          Current Balance
                        </Typography>
                        <Typography variant="h6" color="error.main" sx={{ fontWeight: 700 }}>
                          {formatToINR(account?.CurrentAmount)}
                        </Typography>
                      </Box>

                      <Box sx={{ mt: 1 }}>
                        <Stack direction="row" justifyContent="space-between">
                          <Typography variant="caption" color="text.secondary">
                            Start: {formatToINR(account?.StartAmount)}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Min: {formatToINR(account?.MinAmount)}
                          </Typography>
                        </Stack>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Parties Section */}
        {parties.length > 0 && (
          <Box>
            {accounts.length > 0 && <Divider sx={{ my: 3 }} />}
            <Typography variant="h6" sx={{ mb: 2, color: 'error.main', fontWeight: 600 }}>
              Parties with Negative Balance ({parties.length})
            </Typography>
            <Grid container spacing={2}>
              {parties.map((party) => (
                <Grid item xs={12} sm={6} md={4} key={party?.PartyId}>
                  <Card
                    sx={{
                      border: 2,
                      borderColor: 'error.main',
                      backgroundColor: 'error.light',
                      backgroundOpacity: 0.1,
                      '&:hover': {
                        boxShadow: 4,
                        transform: 'translateY(-2px)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <CardContent sx={{ p: 2 }}>
                      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 1 }}>
                        <CustomAvatar
                          displayName={party?.PartyAvatar}
                          width={35}
                          height={35}
                          iconSize={12}
                        />
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 0.5 }}>
                            {party?.FullName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Party
                          </Typography>
                        </Box>
                        <Chip label="Negative" size="small" color="error" variant="filled" />
                      </Stack>

                      <Box sx={{ mt: 1 }}>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ display: 'block' }}
                        >
                          Current Balance
                        </Typography>
                        <Typography variant="h6" color="error.main" sx={{ fontWeight: 700 }}>
                          {formatToINR(party?.CurrentAmount)}
                        </Typography>
                      </Box>

                      <Box sx={{ mt: 1 }}>
                        <Stack direction="row" justifyContent="space-between">
                          <Typography variant="caption" color="text.secondary">
                            Start: {formatToINR(party?.StartAmount)}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Min: {formatToINR(party?.MinAmount)}
                          </Typography>
                        </Stack>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
