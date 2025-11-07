import { Chip, Stack, Typography, Paper, Box } from '@mui/material'
import Image from 'next/image'
import { useRouter } from 'next/dist/client/router'
import { FC } from 'react'
import { ZoneHumide } from '../..'
import { TYPES_COLORS } from '../../constants'

export interface ItemProps {
  value: ZoneHumide
}

const styles = {
  root: {
    overflow: 'hidden',
    cursor: 'pointer',
  },
  box: {
    borderRadius: '50%',
  },
  content: {
    padding: '4px 5px ',
  },
}

const Item: FC<ItemProps> = ({ value }) => {
  const router = useRouter()

  const handleShowForm = () => {
    router.push({
      pathname: '/map/[slug]',
      query: {
        slug: value.slug,
      },
    })
  }

  return (
    <Paper sx={styles.root} onClick={handleShowForm}>
      <Stack direction="row" spacing={2}>
        <img
          src="/images/thumbnail_not_found.svg"
          width="100px"
          height="100%"
          alt="not-found"
        />
        <Stack sx={styles.content} spacing={1} alignItems="flex-start">
          <Typography
            variant="body2"
            color="textPrimary"
            style={{ fontWeight: 'bold' }}
          >
            {value.nom.toUpperCase()}
          </Typography>
          <Chip
            label={value.type}
            size="small"
          />
        </Stack>
      </Stack>
    </Paper>
  )
}

export default Item
