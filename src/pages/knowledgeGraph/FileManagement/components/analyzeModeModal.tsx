import { ModalForm } from '@ant-design/pro-form';
import { Card, Radio, Tooltip, message } from 'antd';
import type { RadioChangeEvent } from 'antd';
import React, { useState } from 'react';

import { explainFile } from '../api/api';

const { Meta } = Card;

interface analyzeModeModalProps {
  selectAnalyzeMode: any;
  setSelectAnalyzeMode: any;
  fileId: string;
  actionRef: any;
}

const AnalyzeModeModal: React.FC<analyzeModeModalProps> = ({
  selectAnalyzeMode,
  setSelectAnalyzeMode,
  fileId,
  actionRef,
}) => {
  const [analyzeMode, setAnalyzeMode] = useState<number>(0);
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [ner_model, setNerModel] = useState<string>('BertBiLSTMCRF');

  const handleRadioChange = (e: RadioChangeEvent) => {
    setNerModel(e.target.value);
  };

  const handleSelectAnalyzeMode = (selectAnalyzeMode: boolean) => {
    if (!selectAnalyzeMode) {
      setAnalyzeMode(0);
      setSelectedCard(null);
      setSelectAnalyzeMode(false);
    }
  };

  return (
    <ModalForm
      title="选择解析模式"
      width="800px"
      visible={selectAnalyzeMode}
      onVisibleChange={handleSelectAnalyzeMode}
      onFinish={async () => {
        try {
          explainFile({
            fileId: fileId,
            model_type: analyzeMode,
            ner_model: analyzeMode == 1 ? ner_model : '',
          });

          setSelectAnalyzeMode(false);
          message.success('正在解析');
          actionRef.current?.reload?.();
        } catch (error: any) {
          message.error(error.message || '解析失败');
        }
      }}
    >
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Tooltip title="流水线抽取模型">
            <Card
              hoverable
              style={
                selectedCard === 1
                  ? { background: 'linear-gradient(to bottom, #ffffff, #0066cc)' }
                  : { background: '#ffffff' }
              }
              onClick={() => {
                setAnalyzeMode(1);
                setSelectedCard(1);
              }}
            >
              <Meta title="流水线抽取模型" />
            </Card>
          </Tooltip>
          <Tooltip title="联合抽取模型">
            <Card
              hoverable
              style={
                selectedCard === 2
                  ? { background: 'linear-gradient(to bottom, #ffffff, #0066cc)' }
                  : { background: '#ffffff' }
              }
              onClick={() => {
                setAnalyzeMode(2);
                setSelectedCard(2);
              }}
            >
              <Meta title="联合抽取模型" />
            </Card>
          </Tooltip>
          <Tooltip title="融合抽取模型">
            <Card
              hoverable
              style={
                selectedCard === 3
                  ? { background: 'linear-gradient(to bottom, #ffffff, #0066cc)' }
                  : { background: '#ffffff' }
              }
              onClick={() => {
                setAnalyzeMode(3);
                setSelectedCard(3);
              }}
            >
              <Meta title="融合抽取模型" />
            </Card>
          </Tooltip>
          <Tooltip title="llm抽取模型">
            <Card
              hoverable
              style={
                selectedCard === 4
                  ? { background: 'linear-gradient(to bottom, #ffffff, #0066cc)' }
                  : { background: '#ffffff' }
              }
              onClick={() => {
                setAnalyzeMode(4);
                setSelectedCard(4);
              }}
            >
              <Meta title="llm抽取模型" />
            </Card>
          </Tooltip>
        </div>
        {analyzeMode === 1 && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              marginTop: '3%',
              marginBottom: '1%',
            }}
          >
            <Radio.Group
              value={ner_model}
              onChange={handleRadioChange}
              // 靠右放置
            >
              <Radio value="BertBiLSTMCRF">BertBiLSTMCRF</Radio>
              <Radio value="BertBiGRUCRF">BertBiGRUCRF</Radio>
              <Radio value="BertBiLSTMMHACRF">BertBiLSTMMHACRF</Radio>
              <Radio value="RoBERTaBiLSTMCRF">RoBERTaBiLSTMCRF</Radio>
            </Radio.Group>
          </div>
        )}
      </div>
    </ModalForm>
  );
};

export default AnalyzeModeModal;
