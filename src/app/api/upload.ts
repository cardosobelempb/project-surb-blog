import multer from 'multer'
import type { NextApiRequest, NextApiResponse } from 'next'
import path from 'path'

const upload = multer({
    storage: multer.diskStorage({
        destination: './public/uploads',
        filename: (req, file, cb) =>
            cb(null, Date.now() + path.extname(file.originalname)),
    }),
})

const handler = (req: NextApiRequest, res: NextApiResponse) => {
    upload.single('file')(req, res, err => {
        if (err) {
            return res
                .status(500)
                .json({ message: 'Erro ao fazer upload da imagem.' })
        }

        const filePath = `/uploads/${req.file?.filename}`
        return res.status(200).json({ url: filePath })
    })
}

export default handler
