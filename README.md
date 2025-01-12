## start

-   npx create-next-app@latest

## dependencias

-   npm install antd -S
-   npm install @ant-design/nextjs-registry -S
-   npm install @ant-design/cssinjs -S
-   npm install axios -S
-   npm install dayjs -S
-   npm install next-auth@beta -S
-   npm install @auth/prisma-adapter -S
-   npm install @prisma/client -S
-   npm install nodemailer -S
-   npm install next-intl -S
-   npm install react-quilljs quill -S
-   npm install zustand -S

### dev dependencies

-   npm install -D @types/quill -D
-   npm install prisma -D

Para implementar um editor de blog com suporte a imagens usando **React 19**, **Next.js v15** e **TypeScript**, você pode usar bibliotecas como o **React Quill** para o editor de texto, além de configurar uma API em Next.js para upload de imagens. Abaixo estão os passos detalhados para criar esse editor, considerando a versão mais recente do React (React 18, pois o React 19 ainda não foi lançado até a data de corte deste treinamento).

Se você quer usar o **React 18**, que é a versão mais recente do React, vamos usar esse como exemplo, já que você mencionou **React 19**, mas na prática, a instalação e funcionamento será semelhante ao React 18.

### Passo 1: Criação do Projeto

Primeiro, crie um projeto Next.js com suporte a TypeScript.

```bash
npx create-next-app@15.0.0 editor-blog --typescript
cd editor-blog
```

### Passo 2: Instalação das dependências necessárias

Agora, instale o **React Quill** (um editor de texto rico baseado no Quill) e as dependências para upload de imagens.

```bash
npm install react-quill quill
npm install --save-dev @types/react-quill
npm install next-images
```

Além disso, instale o pacote `multer` para lidar com uploads de arquivos.

```bash
npm install multer
npm i --save-dev @types/multer
```

### Passo 3: Configuração do `next.config.js`

O Next.js 15 possui a configuração `next-images`, que permite importar imagens diretamente no código. Para isso, crie ou edite o arquivo `next.config.js` para permitir o carregamento de imagens.

```js
// next.config.js
const withImages = require('next-images')
module.exports = withImages()
```

### Passo 4: Criar o Componente de Editor de Blog

Crie o componente `Editor.tsx` que será usado para editar o conteúdo do blog, incluindo a capacidade de adicionar imagens.

Crie o arquivo `components/Editor.tsx`:

```tsx
import React, { useState, useRef } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css' // Estilos padrão do Quill
import { Quill } from 'react-quill'

interface EditorProps {
    value: string
    onChange: (value: string) => void
}

const Editor: React.FC<EditorProps> = ({ value, onChange }) => {
    const [editorContent, setEditorContent] = useState(value)
    const quillRef = useRef<ReactQuill>(null)

    // Função para lidar com upload de imagens
    const handleImageUpload = () => {
        const fileInput = document.createElement('input')
        fileInput.type = 'file'
        fileInput.accept = 'image/*'
        fileInput.click()

        fileInput.onchange = async e => {
            const file = (e.target as HTMLInputElement).files?.[0]
            if (file) {
                const formData = new FormData()
                formData.append('file', file)

                // Enviar imagem para a API para upload
                const response = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData,
                })

                const data = await response.json()
                const imageUrl = data.url // URL da imagem retornada pela API

                const quill = quillRef.current?.getEditor()
                const range = quill?.getSelection()
                if (quill && range) {
                    quill.insertEmbed(range.index, 'image', imageUrl)
                }
            }
        }
    }

    const modules = {
        toolbar: [
            [{ header: '1' }, { header: '2' }, { font: [] }],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['bold', 'italic', 'underline'],
            ['link'],
            [{ align: [] }],
            ['image'],
            [{ color: [] }, { background: [] }],
            [{ script: 'sub' }, { script: 'super' }],
            ['blockquote', 'code-block'],
            ['clean'],
        ],
    }

    return (
        <div>
            <ReactQuill
                ref={quillRef}
                value={editorContent}
                onChange={onChange}
                modules={modules}
                formats={[
                    'header',
                    'font',
                    'list',
                    'bold',
                    'italic',
                    'underline',
                    'link',
                    'image',
                    'align',
                    'color',
                    'background',
                    'script',
                    'blockquote',
                    'code-block',
                ]}
                theme="snow"
            />
            <button onClick={handleImageUpload}>Inserir Imagem</button>
        </div>
    )
}

export default Editor
```

### Passo 5: Criar API para Upload de Imagens

Agora, crie uma API no Next.js que permita o upload de imagens. Crie o arquivo `pages/api/upload.ts` para lidar com o envio de imagens.

```tsx
// pages/api/upload.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'
import multer from 'multer'

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
```

Crie a pasta `public/uploads` para armazenar as imagens enviadas:

```bash
mkdir public/uploads
```

### Passo 6: Usando o Editor na Página Principal

Agora, na página principal (`pages/index.tsx`), use o componente `Editor` para editar e visualizar o conteúdo do blog.

```tsx
import { useState } from 'react'
import Editor from '../components/Editor'

const Home = () => {
    const [content, setContent] = useState('')

    return (
        <div>
            <h1>Editor de Blog</h1>
            <Editor value={content} onChange={setContent} />
            <div>
                <h2>Preview do conteúdo:</h2>
                <div dangerouslySetInnerHTML={{ __html: content }} />
            </div>
        </div>
    )
}

export default Home
```

### Passo 7: Rodar o Projeto

Agora que o editor está configurado, execute o projeto para testar o editor de blog com imagens:

```bash
npm run dev
```

### Conclusão

Você agora tem um **Editor de Blog** implementado com o **React Quill** e **Next.js**. O editor permite adicionar texto formatado e imagens. A **API de upload** foi configurada para enviar imagens para o servidor e retornar a URL da imagem, que é então inserida no conteúdo do editor.

### Algumas melhorias que você pode considerar:

-   **Armazenamento em nuvem**: Em vez de salvar as imagens localmente, você pode integrar a API com um serviço de armazenamento em nuvem, como **Cloudinary**, **Amazon S3** ou **Google Cloud Storage**.
-   **Validação de arquivos**: Valide os tipos de arquivo para garantir que apenas imagens sejam enviadas.
-   **Estilos adicionais**: Personalize os estilos do Quill ou crie uma toolbar mais avançada.

Esse editor básico já oferece uma boa base para criação de blogs e posts com inserção de imagens.
