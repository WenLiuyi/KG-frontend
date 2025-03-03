import { Modal, Spin, message } from 'antd';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { downloadRule } from '../service';
import React, { useEffect, useState } from 'react';
import { CodeListItem } from '../data';

interface ICodeDisplayProps {
  codeObject: CodeListItem | undefined;
  visible: boolean;
  onClose: (vis: boolean) => void;
}

const CodeDisplay: React.FC<ICodeDisplayProps> = ({ codeObject, visible, onClose }) => {
  if (codeObject == undefined) {
    if (visible) message.error('无法获取学生信息');
    return null;
  }
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('');

  const handleDispla = async (codeId: string | undefined) => {
    try {
      if (codeId === undefined) {
        message.error('获取代码失败请重试！');
        return null;
      } else {
        const content = await downloadRule(codeId);
        return content;
      }
    } catch (error) {
      message.error('获取代码失败请重试！');
      return null;
    }
  };

  const handleGetLang = async () => {
    try {
      const name = codeObject.name;
      const index = name.lastIndexOf('.');
      if (index === -1) {
        setLanguage('text');
        return;
      }
      const lang = name.substring(index + 1);
      setLanguage(lang);
      return;
    } catch (error) {
      setLanguage('text');
      return;
    }
  };

  useEffect(() => {
    if (codeObject !== undefined) {
      const getLang = async () => {
        await handleGetLang();
      };
      const getCode = async () => {
        await getLang();
        if (language) {
          const codeData = await handleDispla(codeObject.id);
          if (codeData) {
            setCode(codeData);
          }
          setLoading(false);
        }
      };
      getCode();
    } else {
      setLoading(false);
    }
  }, [codeObject, language]);

  return (
    <Modal
      title="查看代码"
      open={visible}
      onCancel={() => {
        onClose(false);
        setCode('');
        setLanguage('');
      }}
      width={'70%'}
      footer={null}
    >
      <Spin spinning={loading} size="large">
        {code ? (
          <SyntaxHighlighter language={language} style={tomorrow}>
            {code}
          </SyntaxHighlighter>
        ) : null}
      </Spin>
    </Modal>
  );
};

export default CodeDisplay;
