'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import styles from './StockInfo.module.css';

interface StockEntry {
  companyName: string;
  event: string;
  infoDiff: string;
}

export default function StockInfo() {
  const [entries, setEntries] = useState<StockEntry[]>([]);
  const [newEntry, setNewEntry] = useState<StockEntry>({
    companyName: '',
    event: '',
    infoDiff: ''
  });
  const [previewEntry, setPreviewEntry] = useState<StockEntry | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const currentDate = new Date();
  const month = currentDate.getMonth() + 1;
  const day = currentDate.getDate();

  useEffect(() => {
    if (newEntry.companyName || newEntry.event || newEntry.infoDiff) {
      setPreviewEntry(newEntry);
    } else {
      setPreviewEntry(null);
    }
  }, [newEntry]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewEntry(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newEntry.companyName && newEntry.event && newEntry.infoDiff) {
      setEntries(prev => [...prev, newEntry]);
      setNewEntry({
        companyName: '',
        event: '',
        infoDiff: ''
      });
      setPreviewEntry(null);
    }
  };

  const generateImage = async () => {
    try {
      // 创建一个离屏 canvas
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        alert('无法创建 Canvas 上下文');
        return null;
      }

      // 设置 canvas 尺寸
      canvas.width = 800;
      canvas.height = 200 + (entries.length + (previewEntry ? 1 : 0)) * 50;

      // 设置背景色
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 绘制标题和日期
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 24px Arial';
      ctx.fillText(`${month}月${day}日`, 40, 50);

      // 绘制副标题
      ctx.font = 'bold 20px Arial';
      ctx.fillText('马股信息差', canvas.width - 150, 50);

      // 绘制说明文字
      ctx.font = '18px Arial';
      ctx.fillText('今天这些公司有大事件', 40, 100);

      // 绘制表格头部
      ctx.fillStyle = '#1f2937';
      ctx.fillRect(40, 120, canvas.width - 80, 40);
      
      // 表头文字
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 16px Arial';
      ctx.fillText('公司名称', 60, 145);
      ctx.fillText('事件', 300, 145);
      ctx.fillText('信息差', 540, 145);

      // 绘制表格内容
      ctx.fillStyle = '#000000';
      ctx.font = '16px Arial';
      
      // 绘制已保存的条目
      entries.forEach((entry, index) => {
        const y = 180 + index * 50;
        
        // 绘制行背景
        ctx.fillStyle = index % 2 === 0 ? '#f9fafb' : '#ffffff';
        ctx.fillRect(40, y - 25, canvas.width - 80, 50);
        
        // 绘制文字
        ctx.fillStyle = '#000000';
        ctx.fillText(entry.companyName, 60, y);
        ctx.fillText(entry.event, 300, y);
        ctx.fillText(entry.infoDiff, 540, y);
      });

      // 绘制预览条目（如果有）
      if (previewEntry) {
        const y = 180 + entries.length * 50;
        
        // 绘制预览行背景
        ctx.fillStyle = '#eff6ff'; // 浅蓝色背景
        ctx.fillRect(40, y - 25, canvas.width - 80, 50);
        
        // 绘制文字
        ctx.fillStyle = '#000000';
        ctx.fillText(previewEntry.companyName, 60, y);
        ctx.fillText(previewEntry.event, 300, y);
        ctx.fillText(previewEntry.infoDiff, 540, y);
      }

      // 绘制表格边框
      ctx.strokeStyle = '#e5e7eb';
      ctx.lineWidth = 1;
      ctx.strokeRect(40, 120, canvas.width - 80, 40 + (entries.length + (previewEntry ? 1 : 0)) * 50);

      // 绘制表格列分隔线
      ctx.beginPath();
      ctx.moveTo(240, 120);
      ctx.lineTo(240, 160 + (entries.length + (previewEntry ? 1 : 0)) * 50);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(480, 120);
      ctx.lineTo(480, 160 + (entries.length + (previewEntry ? 1 : 0)) * 50);
      ctx.stroke();

      // 返回图片数据 URL
      return canvas.toDataURL('image/png');
    } catch (error) {
      console.error('生成图片失败:', error);
      
      // 提供更详细的错误信息
      let errorMessage = '未知错误';
      if (error instanceof Error) {
        errorMessage = `${error.name}: ${error.message}`;
        if (error.stack) {
          console.error('错误堆栈:', error.stack);
        }
      } else {
        errorMessage = String(error);
      }
      
      alert(`生成图片失败: ${errorMessage}`);
      return null;
    }
  };

  const previewImageHandler = async () => {
    const imageData = await generateImage();
    if (imageData) {
      setPreviewImage(imageData);
      setShowPreview(true);
    }
  };

  const exportAsImage = async () => {
    const imageData = await generateImage();
    if (imageData) {
      const link = document.createElement('a');
      link.href = imageData;
      link.download = `马股信息差_${month}月${day}日.png`;
      link.click();
    }
  };

  const closePreview = () => {
    setShowPreview(false);
    setPreviewImage(null);
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div ref={contentRef} className={styles.contentCard}>
          <div className={styles.header}>
            <h1 className={styles.title}>{month}月{day}日</h1>
            <div className={styles.flagContainer}>
              <Image 
                src="/malaysia-flag.png" 
                alt="Malaysia Flag" 
                className={styles.flagImage} 
                width={32}
                height={16}
              />
              <h2 className={styles.subtitle}>马股信息差</h2>
            </div>
          </div>
          
          <h3 className={styles.sectionTitle}>今天这些公司有大事件</h3>
          
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead className={styles.tableHead}>
                <tr>
                  <th className={styles.tableHeaderCell}>公司名称</th>
                  <th className={styles.tableHeaderCell}>事件</th>
                  <th className={styles.tableHeaderCell}>信息差</th>
                </tr>
              </thead>
              <tbody className={styles.tableBody}>
                {entries.map((entry, index) => (
                  <tr key={index} className={styles.tableRow}>
                    <td className={styles.tableCell}>{entry.companyName}</td>
                    <td className={styles.tableCell}>{entry.event}</td>
                    <td className={styles.tableCell}>{entry.infoDiff}</td>
                  </tr>
                ))}
                {previewEntry && (
                  <tr className={styles.previewRow}>
                    <td className={styles.tableCell}>{previewEntry.companyName}</td>
                    <td className={styles.tableCell}>{previewEntry.event}</td>
                    <td className={styles.tableCell}>{previewEntry.infoDiff}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.label}>公司名称</label>
            <input
              type="text"
              name="companyName"
              value={newEntry.companyName}
              onChange={handleInputChange}
              className={styles.input}
              title="输入公司名称"
              placeholder="请输入公司名称"
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>事件</label>
            <input
              type="text"
              name="event"
              value={newEntry.event}
              onChange={handleInputChange}
              className={styles.input}
              title="输入事件"
              placeholder="请输入事件"
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>信息差</label>
            <input
              type="text"
              name="infoDiff"
              value={newEntry.infoDiff}
              onChange={handleInputChange}
              className={styles.input}
              title="输入信息差"
              placeholder="请输入信息差"
            />
          </div>
          <div className={styles.buttonContainer}>
            <button
              type="submit"
              className={`${styles.button} ${styles.buttonPrimary}`}
            >
              添加条目
            </button>
            <div className={styles.buttonGroup}>
              <button
                type="button"
                onClick={previewImageHandler}
                className={`${styles.button} ${styles.buttonPurple}`}
              >
                预览图片
              </button>
              <button
                type="button"
                onClick={exportAsImage}
                className={`${styles.button} ${styles.buttonSuccess}`}
              >
                导出图片
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* 图片预览模态框 */}
      {showPreview && previewImage && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>图片预览</h3>
              <button 
                onClick={closePreview}
                className={styles.closeButton}
              >
                关闭
              </button>
            </div>
            <div className={styles.imageContainer}>
              <Image 
                src={previewImage} 
                alt="预览图片" 
                className={styles.previewImage}
                width={800}
                height={600}
                unoptimized={true}
              />
            </div>
            <div className={styles.modalFooter}>
              <button
                onClick={exportAsImage}
                className={`${styles.button} ${styles.buttonSuccess}`}
              >
                下载图片
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 